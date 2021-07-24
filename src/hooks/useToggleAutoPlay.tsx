import * as React from "react";
import { Game } from "../models/Game";

export function useToggleAutoPlay(
  game: Game,
  autoPlay: boolean,
  setAutoPlay: (autoPlay: boolean) => void
) {
  const [autoPlayCount, setAutoPlayCount] = React.useState(0);
  const AUTO_PLAY_COUNT_THRESHOLD = 10;
  React.useEffect(() => {
    if (autoPlayCount > AUTO_PLAY_COUNT_THRESHOLD) {
      setAutoPlay(false);
    }
    setAutoPlayCount(0);
  }, [game]);
  React.useEffect(() => {
    if (autoPlayCount > AUTO_PLAY_COUNT_THRESHOLD && !autoPlay) {
      setAutoPlay(true);
    }
  }, [autoPlayCount > AUTO_PLAY_COUNT_THRESHOLD]);

  return React.useCallback(() => setAutoPlayCount((count) => count + 1), []);
}
