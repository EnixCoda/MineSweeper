import * as React from "react";
import { Cell } from "../models/Cell";
import { Game } from "../models/Game";
import { Grid } from "../models/Grid";
import { Change, solve } from "../models/solver";

export function useSolutions(game: Game) {
  const [lastState, setLastState] = React.useState<Grid<Cell>>(game.grid);
  const [solutions, setSolutions] = React.useState<Change[]>([]);
  React.useEffect(() => {
    setLastState(game.grid);
    if (game.state !== "playing") {
      setSolutions([]);
    } else {
      const newSolutions = solve(game.grid, lastState, solutions);
      setSolutions(newSolutions);
    }
  }, [game.grid, game.state]);

  return solutions;
}
