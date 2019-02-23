import { DataAccess } from 'config';
import { PlaylistSong, UnavailableSongStatus, User } from 'entities';
import { Exception } from 'exceptions';
import { DistinctSongRepository, SongRepository, UserRepository } from 'repositories';
import { Logger, PlaylistSongCRUDService, SongCRUDService, UnavailableSongService } from 'services';
import { PlaylistHelper } from 'team-radio-shared';
import { Container } from 'typedi';
import { RealTimeStationManager, StationTopic } from '.';
import { PlayingSong } from '../types';
import { sleep } from 'utils';

export class RealTimeStationPlayerManager {
  private _playlist: PlaylistSong[] = [];

  private stationTimeout: NodeJS.Timeout | null;

  public parent: RealTimeStationManager;

  public get playlist(): PlaylistSong[] {
    return PlaylistHelper.sortPlaylist(this._playlist, this.parent.currentPlayingSongId);
  }

  public set playlist(playlist: PlaylistSong[]) {
    this._playlist = playlist;
  }

  public playing: PlayingSong | null = null;

  public isSleepingBetweenSongs: boolean = false;

  public getCurrentlyPlayingAt(playingSong?: PlayingSong): number | null {
    const playing = playingSong || this.playing;
    if (playing && this.parent.startingTime) {
      const at = Date.now() - this.parent.startingTime || 0;
      if (at < playing.song.duration) {
        return at;
      }
    }
    return null;
  }

  public async start() {
    if (!this.playlist[0]) return;
    try {
      this.playing = this.pickPlayingSong();
      // Check if the playing should be played
      await this.checkWhetherToSkipSong(this.playing.song.id, this.playing.song.upVotes, this.playing.song.downVotes);
      this.clearPlayerTimeout();
      // In normal case, start the player base on playing value
      // start the next song timeout with song duration
      let timeout = this.playing.song.duration;
      // Then calculate the actual remain time of the song
      const currentlyPlayingAt = this.getCurrentlyPlayingAt();
      if (currentlyPlayingAt) {
        timeout = timeout - currentlyPlayingAt;
      }
      this.stationTimeout = setTimeout(this.next.bind(this), timeout);
      // then update station & player state
      await this.parent.publish<StationTopic.UpdatePlayerSongPayLoad>(StationTopic.UPDATE_PLAYER_SONG, {
        song: this.playing.song
      });
      await this.updateStationState(this.playing.startedAt);
    } catch (e) {
      // In case of the pickingPlayingSong throw an Exception,
      // because the first song in playlist has been out of play time,
      // shift it then restart the player
      const playedSong = await this.shiftSong();
      playedSong.isPlayed = true;
      this.logger.info(`Song ${playedSong.id} has been out of play time. Prepare to restart the player.`);
      await this.songRepository.saveOrFail(playedSong);
      await this.updateStationState(null);
      await this.start();
    }
  }

  public async next() {
    // Remove song from playlist then update it
    const playedSong = await this.shiftSong();
    playedSong.isPlayed = true;
    this.playing = null;
    this.parent.publish<StationTopic.UpdatePlayerSongPayLoad>(StationTopic.UPDATE_PLAYER_SONG, {
      song: null
    });
    // Clear the player timeout
    this.clearPlayerTimeout();
    // Then update station & player state
    await Promise.all([
      this.updateStationState(null),
      //
      this.songRepository.saveOrFail(playedSong)
    ]);

    // After finishing a song, wait 5000 second to play the next one.
    this.logger.info(`Finish song ${playedSong.id}, preparing for the next one.`);

    await this.restart();
  }

  public async restart() {
    // auto add song if this is the end of playlist and there is at least 1 user in station
    // TODO: Add flag to auto add song or not
    if (!this.playlist[0] && this.parent.onlineCount) {
      await this.nextByPickingRandomSong();
    }
    // Or if the playlist already has a song,
    // pending in 5 seconds
    else {
      this.isSleepingBetweenSongs = true;
      await sleep(5000);
      this.isSleepingBetweenSongs = false;
      await this.start();
    }
  }

  // TODO: Do we need this feature?
  public pause() {
    throw new Exception('This feature is not supported yet!');
  }

  public async stop() {
    this.clearPlayerTimeout();
    const stoppedSong = await this.shiftSong();
    this.playing = null;
    stoppedSong.isPlayed = true;
    await Promise.all([
      this.updateStationState(null),
      //
      this.songRepository.saveOrFail(stoppedSong)
    ]);
    await this.parent.publish<StationTopic.UpdatePlayerSongPayLoad>(StationTopic.UPDATE_PLAYER_SONG, {
      song: null
    });
  }

  public async upVoteSong(songId: string, user: User): Promise<boolean> {
    const song = this._playlist.find(song => song.id === songId);
    if (!song) return false;
    song.downVotes = song.downVotes.filter(userId => userId !== user.id);
    if (song.upVotes.find(userId => userId === user.id)) {
      song.upVotes = song.upVotes.filter(userId => userId !== user.id);
    } else {
      song.upVotes = [...song.upVotes, user.id];
    }
    await this.playlistSongCRUDService.updateVotes(songId, song.upVotes, song.downVotes);
    this.checkWhetherToSkipSong(songId, song.upVotes, song.downVotes);
    return true;
  }

  public async downVoteSong(songId: string, user: User): Promise<boolean> {
    const song = this._playlist.find(song => song.id === songId);
    if (!song) return false;
    song.upVotes = song.upVotes.filter(userId => userId !== user.id);
    if (song.downVotes.find(userId => userId === user.id)) {
      song.downVotes = song.downVotes.filter(userId => userId !== user.id);
    } else {
      song.downVotes = [...song.downVotes, user.id];
    }
    await this.playlistSongCRUDService.updateVotes(songId, song.upVotes, song.downVotes);
    this.checkWhetherToSkipSong(songId, song.upVotes, song.downVotes);
    return true;
  }

  public async checkWhetherToSkipSong(songId: string, upVotes: string[], downVotes: string[]) {
    if (this.playing && this.playing.song.id === songId) {
      this.playing.song.upVotes = upVotes;
      this.playing.song.downVotes = downVotes;
      // TODO: Should we publish new changed player song?
      /**
       * The skip song rule will only apply to the votes of online users
       * offline users or anonymous user are not counted
       */
      const onlineDownVotes = downVotes.filter(userId => {
        return !!this.parent.onlineUsers.find(user => userId === user.id);
      });
      const onlineUpVotes = upVotes.filter(userId => {
        return !!this.parent.onlineUsers.find(user => userId === user.id);
      });
      /**
       * The comparision will be active if downVotes count is more than upVotes
       */
      if (onlineDownVotes.length - onlineUpVotes.length > 0) {
        await this.parent.publish<StationTopic.SkipPlayerSongPayLoad>(StationTopic.SKIP_PLAYER_SONG, {
          isSkipping: true,
          songId: this.playing.song.id
        });
        await sleep(5000);
        await this.stop();
        await this.restart();
      }
    }
  }

  private async nextByPickingRandomSong(): Promise<void> {
    if (this.parent.onlineCount < 1) {
      this.logger.info('No online users, cancel auto picking');
      return;
    }
    const randomizedNextSong = await this.distinctSongRepository.findRandomPlayedSong(this.parent.id);
    const verifiedResult = await this.unavailableSongService.verifySong(randomizedNextSong.url);
    if (!verifiedResult.valid) {
      this.nextByPickingRandomSong();
      return;
    }
    this.logger.debug(`Picked a random song ${randomizedNextSong.url}`);
    const songOwner = await this.userRepository.findOneOrFail(randomizedNextSong.creatorId);
    try {
      const nextSong = await this.songCRUDService.create(randomizedNextSong.url, this.parent.id, songOwner.id);
      this.logger.info(`Ready for the next random song ${nextSong.id} in 5 seconds.`);

      await this.parent.publish<StationTopic.AddPlaylistSongPayLoad>(StationTopic.ADD_PLAYLIST_SONG, {
        song: nextSong,
        user: songOwner
      });
    } catch (e) {
      this.logger.info(`Video not found ${randomizedNextSong.url}, re-pick.`);
      await this.unavailableSongService.createUnavailableSong(randomizedNextSong.url, UnavailableSongStatus.NOT_FOUND);
      this.nextByPickingRandomSong();
    }
  }

  private async shiftSong(index: number = 0): Promise<PlaylistSong> {
    const removedSong = this.playlist[index];
    this.logger.debug('before changed playlist', this._playlist);
    const songIndex = this._playlist.findIndex(song => song.id === removedSong.id);
    if (songIndex < 0) {
      this.logger.error('Can not shift song.', { index, songIndex, playlist: this._playlist });
      throw new Exception('Can not shift song.');
    }
    this._playlist.splice(songIndex, 1);
    this.logger.debug('after changed playlist', this._playlist);
    await this.parent.publish<StationTopic.RemovePlaylistSongPayLoad>(StationTopic.REMOVE_PLAYLIST_SONG, {
      songId: removedSong.id
    });
    await this.parent.publish<StationTopic.AddSongToHistory>(StationTopic.ADD_SONG_TO_HISTORY, { song: removedSong });
    return removedSong;
  }

  private pickPlayingSong(): PlayingSong {
    if (this.parent.currentPlayingSongId && this.parent.startingTime) {
      const song = this.playlist.find(song => song.id === this.parent.currentPlayingSongId);
      if (song) {
        const playingSong = new PlayingSong(song, this.parent.startingTime);
        if (this.getCurrentlyPlayingAt(playingSong)) {
          return playingSong;
        }
      }
      throw new Exception('Song not found or out of playing time');
    }
    return new PlayingSong(this.playlist[0]);
  }

  private async updateStationState(startingTime: number | null) {
    const currentPlayingSongId = this.playing ? this.playing.song.id : null;
    return this.parent.updateStationState(startingTime, currentPlayingSongId);
  }

  private clearPlayerTimeout() {
    if (this.stationTimeout) {
      clearTimeout(this.stationTimeout);
      this.stationTimeout = null;
    }
  }

  private get songRepository(): SongRepository {
    return Container.get(DataAccess).connection.getCustomRepository(SongRepository);
  }

  private get distinctSongRepository(): DistinctSongRepository {
    return Container.get(DistinctSongRepository);
  }

  private get userRepository(): UserRepository {
    return Container.get(DataAccess).connection.getCustomRepository(UserRepository);
  }

  private get songCRUDService(): SongCRUDService {
    return Container.get(SongCRUDService);
  }

  private get playlistSongCRUDService(): PlaylistSongCRUDService {
    return Container.get(PlaylistSongCRUDService);
  }

  private get unavailableSongService(): UnavailableSongService {
    return Container.get(UnavailableSongService);
  }

  private get logger(): Logger {
    return Container.get(Logger);
  }
}
