import React from 'react';

type CallBackFn = () => void;

export function useInterval(callback: CallBackFn, delay: number) {
  const savedCallback = React.useRef<CallBackFn | null>(null);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
