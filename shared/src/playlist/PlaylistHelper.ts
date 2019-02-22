export namespace PlaylistHelper {
  export function sortPlaylist<T extends Song>(playlist: T[], currentPlayingSongId: string | null): T[] {
    return playlist.sort((s1, s2) => {
      // Sort by current playing song
      if (currentPlayingSongId) {
        if (s1.id === currentPlayingSongId) return -1;
        if (s2.id === currentPlayingSongId) return 1;
      }
      // Then by votes
      if (s1.upVotes.length > 0 || s2.upVotes.length > 0 || s1.downVotes.length > 0 || s2.downVotes.length > 0) {
        const s2Votes = s2.upVotes.length - s2.downVotes.length;
        const s1Votes = s1.upVotes.length - s1.downVotes.length;
        return s2Votes - s1Votes;
      }
      // Finally by created at
      return s1.createdAt - s2.createdAt;
    });
  }

  export interface Song {
    id: string;
    createdAt: number;
    upVotes: string[];
    downVotes: string[];
  }
}
