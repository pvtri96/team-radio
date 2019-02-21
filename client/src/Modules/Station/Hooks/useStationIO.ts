import { CurrentUserQuery, JoinStationMutation, LeaveStationMutation, RealTimeStationQuery } from '@RadioGraphql';
import * as React from 'react';

/**
 * Mainly designed for station page, this module will decide when to join/leave station
 * P/S: IO => In/Out
 */
export function useStationIO(
  variables: RealTimeStationQuery.Variables,
  station: RealTimeStationQuery.Station | undefined
) {
  const currentUserQuery = CurrentUserQuery.useQuery({ suspend: false });

  const joinStation = JoinStationMutation.useMutation({ variables });
  const leaveStation = LeaveStationMutation.useMutation({ variables });

  React.useEffect(() => {
    if (!station || !currentUserQuery.data) return;
    const { onlineUsers, onlineAnonymous } = station;
    let userId: string;
    // tslint:disable-next-line prefer-conditional-expression
    if (currentUserQuery.data.currentUser) {
      userId = currentUserQuery.data.currentUser.id;
    } else {
      userId = localStorage.getItem('clientId') as string;
    }
    if (isUserAlreadyInStation(onlineUsers, onlineAnonymous, userId)) joinStation();
  }, [variables.stationId, station, currentUserQuery]);

  React.useEffect(() => {
    return () => {
      leaveStation();
    };
  }, [variables.stationId]);
}

function isUserAlreadyInStation(
  onlineUsers: RealTimeStationQuery.OnlineUser[],
  onlineAnonymous: RealTimeStationQuery.OnlineAnonymous[],
  userId: string
) {
  if (onlineUsers.find(user => user.id === userId)) return true;
  if (onlineAnonymous.find(user => user.clientId === userId)) return true;
  return false;
}
