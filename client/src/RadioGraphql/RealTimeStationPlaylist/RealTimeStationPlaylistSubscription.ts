import { SubscribeToMoreOptions } from 'apollo-boost';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  RealTimeStationPlaylistQueryPlaylist,
  RealTimeStationPlaylistQueryResponse,
  RealTimeStationPlaylistQueryVariables
} from '.';

const SUBSCRIPTION = gql`
  subscription onStationPlaylistChanged($stationId: String!) {
    onStationPlaylistChanged(stationId: $stationId) {
      currentPlayingSongId
      playlist {
        id
        url
        thumbnail
        title
        creatorId
        createdAt
        duration
        upVotes
        downVotes
      }
    }
  }
`;

export const withHOC = <TProps>() => graphql<TProps, Response, Variables>(SUBSCRIPTION);

export function getSubscribeToMoreOptions(
  variables: Variables
): SubscribeToMoreOptions<RealTimeStationPlaylistQueryResponse, RealTimeStationPlaylistQueryVariables, Response> {
  return {
    variables,
    document: SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;

      return {
        ...prev,
        StationPlaylist: subscriptionData.data.onStationPlaylistChanged
      };
    }
  };
}

export interface Response {
  readonly onStationPlaylistChanged: RealTimeStationPlaylistQueryPlaylist;
}

export interface Variables {
  stationId: string;
}