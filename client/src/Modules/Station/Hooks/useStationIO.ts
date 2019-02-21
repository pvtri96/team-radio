import { useToggle } from '@Hooks';
import { CurrentUserQuery, JoinStationMutation, LeaveStationMutation, RealTimeStationQuery } from '@RadioGraphql';
import * as React from 'react';

/**
 * Mainly designed for station page, this module will decide when to join/leave station
 * P/S: IO => In/Out
 */
export function useStationIO(variables: RealTimeStationQuery.Variables) {
  const [isJoining, isJoiningAction] = useToggle(false);

  const joinStation = JoinStationMutation.useMutation({ variables });
  const leaveStation = LeaveStationMutation.useMutation({ variables });

  React.useEffect(() => {
    isJoiningAction.toggleOn();
    joinStation().then(isJoiningAction.toggleOff);
    return () => {
      leaveStation();
    };
  }, [variables.stationId]);

  return { isJoining };
}
