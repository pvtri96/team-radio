import { useToggle } from '@Hooks';
import { JoinStationMutation, LeaveStationMutation, RealTimeStationQuery, RealTimeStationsQuery } from '@RadioGraphql';
import * as React from 'react';

/**
 * Mainly designed for station page, this module will decide when to join/leave station
 * P/S: IO => In/Out
 */
export function useStationIO(variables: RealTimeStationQuery.Variables) {
  const [isJoining, isJoiningAction] = useToggle(false);

  const joinStation = JoinStationMutation.useMutation({ variables });
  const leaveStation = LeaveStationMutation.useMutation({ variables });

  const allStationsQuery = RealTimeStationsQuery.useQuery({ suspend: false, notifyOnNetworkStatusChange: true });
  const stationQuery = RealTimeStationQuery.useQuery({ variables, suspend: false, notifyOnNetworkStatusChange: true });
  const shouldJoin = React.useMemo<boolean>(() => {
    if (allStationsQuery.data && allStationsQuery.data.items && stationQuery.data && stationQuery.data.item) {
      return true;
    }
    return false;
  }, [allStationsQuery, stationQuery]);

  React.useEffect(() => {
    if (!shouldJoin) return;
    isJoiningAction.toggleOn();
    joinStation().then(isJoiningAction.toggleOff);
    return () => {
      leaveStation();
    };
  }, [variables.stationId, shouldJoin]);

  return { isJoining };
}
