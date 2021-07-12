import * as React from "react";

export function useUpdate() {
  const [, setCount] = React.useState(0);
  return React.useCallback(() => setCount((count) => count + 1), []);
}
