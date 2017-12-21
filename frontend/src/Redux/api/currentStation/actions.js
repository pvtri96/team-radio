// server action types
export const SERVER_JOINED_STATION = 'SERVER:JOINED_STATION';
export const SERVER_UPDATE_STATION = 'SERVER:UPDATE_STATION';

// Server action creator

// Client action types
export const CLIENT_JOIN_STATION = 'CLIENT:JOIN_STATION';
export const CLIENT_UPVOTE_VIDEO = 'CLIENT:UP_VOTE_VIDEO';
export const CLIENT_UN_UPVOTE_VIDEO = 'CLIENT:UN_UP_VOTE_VIDEO';

// Client action creator
export const joinStation = stationId => ({
  type: CLIENT_JOIN_STATION,
  payload: { stationId },
});

export const upVoteVideo = ({ stationId, videoId }) => ({
  type: CLIENT_UPVOTE_VIDEO,
  payload: { stationId, videoId },
});

export const unUpVoteVideo = ({ stationId, videoId }) => ({
  type: CLIENT_UN_UPVOTE_VIDEO,
  payload: { stationId, videoId },
});