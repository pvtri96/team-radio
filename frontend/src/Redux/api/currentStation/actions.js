import {
  CLIENT_ADD_SONG,
  CLIENT_UPVOTE_SONG,
  CLIENT_JOIN_STATION,
  CLIENT_DOWNVOTE_SONG,
  CLIENT_FAVOURITE_SONG,
  CLIENT_LEAVE_STATION,
} from 'Redux/actions';

const DEFAULT_USER_ID = '0';

// Client action creator
export const joinStation = ({ stationId, userId = DEFAULT_USER_ID }) => ({
  type: CLIENT_JOIN_STATION,
  payload: { userId, stationId },
});

export const leaveStation = ({ stationId, userId = DEFAULT_USER_ID }) => ({
  type: CLIENT_LEAVE_STATION,
  payload: { userId, stationId },
});

export const addSong = ({
  userId = DEFAULT_USER_ID,
  stationId,
  songUrl,
  title,
  thumbnail,
  creator,
}) => ({
  type: CLIENT_ADD_SONG,
  payload: {
    userId,
    stationId,
    songUrl,
    title,
    thumbnail,
    creator,
    is_played: false,
    up_vote: [],
    down_vote: [],
  },
});

export const upVoteSong = ({
  userId = DEFAULT_USER_ID,
  stationId,
  songId,
}) => ({
  type: CLIENT_UPVOTE_SONG,
  payload: { userId, stationId, songId },
});

export const downVoteSong = ({
  userId = DEFAULT_USER_ID,
  stationId,
  songId,
}) => ({
  type: CLIENT_DOWNVOTE_SONG,
  payload: { userId, stationId, songId },
});

export const favouriteSongRequest = ({
  songId,
  userId = DEFAULT_USER_ID,
  stationId,
  songUrl,
}) => ({
  type: CLIENT_FAVOURITE_SONG,
  payload: { songId, userId, stationId, songUrl },
});
