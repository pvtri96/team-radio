import { PlaylistSong } from 'entities';
import { Field, Int, ObjectType } from 'type-graphql';
import { RealTimeStationPlayerManager } from '../station/RealTimeStationPlayerManager';

@ObjectType()
export class RealTimeStationPlaylist {
  @Field(type => [PlaylistSong])
  public playlist: PlaylistSong[] = [];

  @Field(type => Int, { nullable: true })
  public currentlyPlayingAt: number | null = null;

  @Field(type => String, { nullable: true })
  public currentPlayingSongId: string | null = null;

  static fromRealTimeStationPlayerManager(manager: RealTimeStationPlayerManager): RealTimeStationPlaylist {
    const instance = new RealTimeStationPlaylist();
    instance.playlist = manager.playlist;
    instance.currentlyPlayingAt = manager.getCurrentlyPlayingAt();
    if (manager.playing) {
      instance.currentPlayingSongId = manager.playing.song.id;
    }
    return instance;
  }
}
