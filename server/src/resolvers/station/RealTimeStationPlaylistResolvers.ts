import { IAuthenticatedContext } from 'config';
import { Song } from 'entities';
import { NotInStationBadRequestException } from 'exceptions';
import { SongCRUDService } from 'services';
import { RealTimeStationPlaylist, RealTimeStationsManager, StationTopic } from 'subscription';
import { Arg, Authorized, Ctx, Mutation, Publisher, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseResolver } from '../BaseResolver';

@Resolver(of => RealTimeStationPlaylist)
export class RealTimeStationPlaylistResolver extends BaseResolver<RealTimeStationPlaylist> {
  @Inject()
  private songCRUDService: SongCRUDService;

  @Inject()
  private manager: RealTimeStationsManager;

  @Authorized()
  @Mutation(returns => Song, { description: 'Add song to a station, required to join a station first.' })
  public async addSong(
    @Arg('url') url: string,
    @Ctx() context: IAuthenticatedContext,
    @PubSub(StationTopic.ADD_PLAYLIST_SONG) publish: Publisher<StationTopic.AddPlaylistSongPayLoad>
  ): Promise<Song> {
    if (!context.currentStation) throw new NotInStationBadRequestException();
    const song = await this.songCRUDService.create(url, context.currentStation.id, context.user.id);
    publish({ song, stationId: context.currentStation.stationId, user: context.user });
    return song;
  }

  @Authorized()
  @Mutation(returns => Boolean, { description: 'Up vote a playlist song, required to join a station first.' })
  public async upVoteSong(
    @Arg('songId') songId: string,
    @Ctx() context: IAuthenticatedContext,
    @PubSub(StationTopic.UP_VOTE_SONG) publish: Publisher<StationTopic.UpVoteSongPayload>
  ): Promise<boolean> {
    if (!context.currentStation) throw new NotInStationBadRequestException();
    const { player } = this.manager.findStation(context.currentStation.stationId);
    const result = await player.upVoteSong(songId, context.user);
    if (result) {
      publish({ songId, stationId: context.currentStation.stationId });
      return true;
    }
    return false;
  }

  @Authorized()
  @Mutation(returns => Boolean, { description: 'Down vote a playlist song, required to join a station first.' })
  public async downVoteSong(
    @Arg('songId') songId: string,
    @Ctx() context: IAuthenticatedContext,
    @PubSub(StationTopic.DOWN_VOTE_SONG) publish: Publisher<StationTopic.DownVoteSongPayload>
  ): Promise<boolean> {
    if (!context.currentStation) throw new NotInStationBadRequestException();
    const { player } = this.manager.findStation(context.currentStation.stationId);
    const result = await player.downVoteSong(songId, context.user);
    if (result) {
      publish({ songId, stationId: context.currentStation.stationId });
      return true;
    }
    return false;
  }

  @Query(returns => RealTimeStationPlaylist, {
    name: 'StationPlaylist',
    description:
      'Query station current playlist state, ' +
      'combine with "onStationPlaylistChanged" for fetching initial data then listening for changes.'
  })
  public getPlaylist(@Arg('stationId') stationId: string): RealTimeStationPlaylist {
    return RealTimeStationPlaylist.fromRealTimeStationPlayerManager(this.manager.findStation(stationId).player);
  }

  @Subscription(returns => RealTimeStationPlaylist, {
    name: 'onStationPlaylistChanged',
    topics: [
      StationTopic.ADD_PLAYLIST_SONG,
      StationTopic.REMOVE_PLAYLIST_SONG,
      StationTopic.UPDATE_PLAYER_SONG,
      StationTopic.UP_VOTE_SONG,
      StationTopic.DOWN_VOTE_SONG,
      StationTopic.SKIP_PLAYER_SONG
    ],
    filter: ({ args, payload }) => payload.stationId === args.stationId,
    description: 'Subscribe to changes on station player manager like: add song, remove song, update song,...'
  })
  public subscribeStationPlaylist(
    @Root() payload: StationTopic.SkipPlayerSongPayLoad | unknown,
    @Arg('stationId') stationId: string
  ): RealTimeStationPlaylist {
    let currentPlayingSongId: string | undefined = undefined;
    if ((payload as StationTopic.SkipPlayerSongPayLoad).isSkipping) {
      currentPlayingSongId = (payload as StationTopic.SkipPlayerSongPayLoad).songId;
    }
    return RealTimeStationPlaylist.fromRealTimeStationPlayerManager(
      this.manager.findStation(stationId).player,
      currentPlayingSongId
    );
  }
}
