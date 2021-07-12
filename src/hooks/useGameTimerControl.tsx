import * as React from "react";
import { Game } from "../models/Game";

export function useGameTimerControl(game: Game, timer: { value: number; mutations: { start(): void; pause(): void; reset(): void; }; }) {
  React.useEffect(() => {
    switch (game.state) {
      case "playing":
        return timer.mutations.start();
      case "idle":
        return timer.mutations.reset();
      case "win":
      case "lose":
        return timer.mutations.pause();
    }
  }, [game.state]);
}
