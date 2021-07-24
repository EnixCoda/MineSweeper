import { Grid } from "@chakra-ui/react";
import * as React from "react";
import { Game } from "../models/Game";
import { formatTime } from "../utils";

export function StatusBar({ time, game }: { time: number; game: Game }) {
  return (
    <Grid
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateRows="48px"
      justifyItems="center"
      alignItems="center"
      paddingX="2"
      paddingY="1"
    >
      <div className="flex-row">
        <span className="emoji-center">⏱</span>
        <pre>{formatTime(time, 5)}</pre>
      </div>
      <GameState state={game.state} />
      <span>{game.mineCount - game.flagCount} 💣</span>
    </Grid>
  );
}

function GameState({ state }: { state: Game["state"] }) {
  return <span className="emoji-center">{renderState(state)}</span>;
}

function renderState(state: string) {
  switch (state) {
    case "idle":
      return "⏸";
    case "playing":
      return "▶️";
    case "win":
      return "🏆";
    case "lose":
      return "❌";
  }
}
