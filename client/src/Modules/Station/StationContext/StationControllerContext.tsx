import { RealTimeStationQuery } from '@RadioGraphql';
import * as React from 'react';

export interface IStationControllerLocalState {
  muted: boolean;
}

export interface IStationControllerNetworkState {
  onlineUsers: RealTimeStationQuery.OnlineUser[];
  onlineAnonymous: RealTimeStationQuery.OnlineAnonymous[];
  onlineCount: number;
  isJoining: boolean;
}

export interface IStationController extends IStationControllerLocalState, IStationControllerNetworkState {
  setMuted: (value: boolean) => void;
}

export const StationControllerContext = React.createContext<IStationController>({
  muted: false,
  isJoining: false,
  onlineUsers: [],
  onlineAnonymous: [],
  onlineCount: 0,

  setMuted: () => ({})
});
