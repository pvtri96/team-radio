import { useInterval } from '@Hooks';
import * as React from 'react';

export const CountDown: React.FunctionComponent<CoreProps> = props => {
  const [state, setState] = React.useState(props.initialCount * 1000);

  useInterval(() => {
    setState(currentState => {
      if (currentState > 0) {
        return currentState - 1000;
      }
      return currentState;
    });
  }, 1000);

  return <>{Math.floor(state / 1000)}</>;
};

interface CoreProps extends Props {}

export interface Props {
  /**
   * in seconds
   */
  initialCount: number;
}
