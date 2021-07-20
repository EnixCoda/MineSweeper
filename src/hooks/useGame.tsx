import * as React from "react";
import { Game } from "../models/Game";

export type Level = {
  width: number;
  height: number;
  mines: number;
};

export function useGame(update: () => void, defaultLevel: Level) {
  const createGame = React.useCallback(
    ({ width, height, mines }: Level) => new Game(width, height, mines, update),
    []
  );
  const [game, setGame] = React.useState(() => createGame(defaultLevel));
  const startGame = React.useCallback(
    (level: Level) => setGame(createGame(level)),
    [createGame]
  );
  return [game, startGame] as const;
}
