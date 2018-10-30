import gql from 'graphql-tag';
import * as React from 'react';
import { DataProps, graphql, Query as GraphQLQuery } from 'react-apollo';
import { PartialQueryProps } from '../types';

const QUERY = gql`
  {
    allRealTimeStations {
      id
      createdAt
      isPrivate
      ownerId
      stationId
      stationName
      onlineCount
      thumbnail
    }
  }
`;

export class QueryComponent extends GraphQLQuery<Response, Variables> {}

export default function AllRealTimeStationsQuery(props: Props) {
  return <QueryComponent query={QUERY} {...props} />;
}

export function withHOC<TProps>() {
  return graphql<TProps, Response, Variables>(QUERY);
}

export interface Station {
  readonly id: string;
  readonly stationId: string;
  readonly stationName: string;
  readonly createdAt: string;
  readonly ownerId: string;
  readonly isPrivate: boolean;
  readonly onlineCount: number;
  readonly thumbnail?: string;
}

export interface Response {
  readonly allRealTimeStations: Station[];
}

export interface Variables {}

export interface WithHOCProps extends DataProps<Response, Variables> {}

export interface Props extends PartialQueryProps<Response, Variables> {}
