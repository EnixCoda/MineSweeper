import * as React from "react";

export function useHistory<T>(latest: T) {
  const [history, setHistory] = React.useState<T[]>([]);
  React.useEffect(() => {
    if (!history.includes(latest)) setHistory(history.concat(latest));
  }, [latest]);

  const goBack = React.useCallback(
    function goBack() {
      setHistory(history.slice(0, -1));
    },
    [history]
  );

  return [history, goBack] as const;
}
