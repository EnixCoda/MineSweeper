import * as React from "react";
import { Game } from "../models/Game";
import { Solution, solve } from "../models/solver";

export function useSolutions(game: Game, active: boolean) {
  const [solutions, setSolutions] = React.useState<Solution[]>([]);
  React.useEffect(() => {
    if (active) {
      setSolutions(game.state === "playing" ? solve(game.grid) : []);
    }
  }, [game, game.grid, game.state, active]);

  return solutions;
}
