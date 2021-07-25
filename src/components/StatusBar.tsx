import { Grid, GridItem, Text } from "@chakra-ui/react";
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
      fontSize="xl"
    >
      <GridItem justifySelf="flex-start">
        <span className="emoji-center">⏱</span>
        <Text as="span" fontFamily="mono" marginX="1">{formatTime(time, 5)}</Text>
      </GridItem>
      <GameState state={game.state} />
      <GridItem justifySelf="flex-end">
        <Text as="span" fontFamily="mono" marginX="1">{game.mineCount - game.flagCount}</Text>
        <span className="emoji-center">💣</span>
      </GridItem>
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
