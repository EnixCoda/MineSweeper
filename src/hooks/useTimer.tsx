import * as React from "react";

export function useTimer() {
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    if (running) {
      const startTime = Date.now()
      const interval = setInterval(() => setTime(Date.now() - startTime), 1000);
      return () => clearInterval(interval)
    }
  }, [running]);
  const mutations = React.useMemo(
    () => ({
      start() {
        setRunning(true);
      },
      pause() {
        setRunning(false);
      },
      reset() {
        setTime(0);
        setRunning(false);
      },
    }),
    []
  );
  return {
    value: time,
    mutations,
  };
}
