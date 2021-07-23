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
    setSolutions(
      game.state === "playing" ? solve(game.grid, lastState, solutions) : []
    );
  }, [game, game.grid, game.state]);

  return solutions;
}
