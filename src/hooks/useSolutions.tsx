import * as React from "react";
import { Cell } from "../models/Cell";
import { Game } from "../models/Game";
import { Grid } from "../models/Grid";
import { Solution, solve } from "../models/solver";

export function useSolutions(game: Game, active: boolean) {
  const [lastState, setLastState] = React.useState<Grid<Cell>>(game.grid);
  const [solutions, setSolutions] = React.useState<Solution[]>([]);
  React.useEffect(() => {
    setLastState(game.grid);
    if (active) {
      setSolutions(
        game.state === "playing" ? solve(game.grid, lastState, solutions) : []
      );
    }
  }, [game, game.grid, game.state, active]);

  return solutions;
}
