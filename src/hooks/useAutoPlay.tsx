import { useToast, useUpdateEffect } from "@chakra-ui/react";
import * as React from "react";
import { Game } from "../models/Game";
import { Solution } from "../models/solver";

export function useAutoPlay(game: Game, solutions: Solution[]) {
  const [autoPlay, setAutoPlay] = React.useState(false);
  const toast = useToast();
  useUpdateEffect(() => {
    toast(
      autoPlay
        ? {
            position: "top",
            title: "Auto Play is ON",
            status: "success",
            duration: 2000,
          }
        : {
            position: "top",
            title: "Auto Play is OFF",
            status: "info",
            duration: 2000,
          }
    );
  }, [autoPlay]);

  const applySolutions = React.useCallback(
    (solutions: Solution[]) => {
      if (solutions.length) {
        game.mutate(() =>
          solutions.forEach(([position, action]) =>
            game.onAction(position, action)
          )
        );
      }
    },
    [game]
  );

  React.useEffect(() => {
    if (autoPlay) {
      const timeout = setTimeout(() => applySolutions(solutions), 0 * 100);
      return () => clearTimeout(timeout);
    }
  }, [applySolutions, autoPlay, solutions]);

  return [autoPlay, setAutoPlay, applySolutions] as const;
}
