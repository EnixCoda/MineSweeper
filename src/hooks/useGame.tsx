import * as React from "react";
import { Game } from "../models/Game";

export function useGame(update: () => void) {
  const createGame = React.useCallback(
    (width: number, height: number, mines: number) => new Game(width, height, mines, update),
    []
  );
  const [game, setGame] = React.useState(() => createGame(10, 10, 10));
  const startGame = React.useCallback(
    (width: number, height: number, mines: number) => setGame(createGame(width, height, mines)),
    [createGame]
  );
  return [game, startGame] as const;
}
