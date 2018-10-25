export namespace PlaylistHelper {
  export function sortPlaylist<T extends Song>(playlist: T[], currentPlayingSongId: string | null): T[] {
    return playlist.sort((s1, s2) => {
      // Sort by current playing song
      if (currentPlayingSongId && s1.id === currentPlayingSongId) return -1;
      // Then by upVotes
      if (s1.upVotes.length > 0 || s2.upVotes.length > 0) s2.upVotes.length - s1.upVotes.length;
      // Finally by created at
      return s2.createdAt - s1.createdAt;
    });
  }

  export interface Song {
    id: string;
    createdAt: number;
    upVotes: string[];
    downVotes: string[];
  }
}