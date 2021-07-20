import * as React from "react";
import { Level, levels } from "../constants";
import { Game } from "../models/Game";
import { formatTime } from "../utils";

export function StatusBar({
  time,
  game,
  level,
  setLevel,
  startGame,
}: {
  time: number;
  game: Game;
  level: Level;
  setLevel: (level: Level) => void;
  startGame: (level: { width: number; height: number; mines: number }) => void;
}) {
  return (
    <div>
      <div className="start-game">
        <select
          name="level"
          className="level-select"
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          {Array.from(levels.keys()).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button onClick={() => startGame(levels.get(level)!)}>New Game</button>
      </div>
      <div className="status-bar">
        <div className="flex-row">
          <span className="emoji-center">⏱</span>
          <pre>{formatTime(time)}</pre>
        </div>
        <GameState state={game.state} />
        <span>{game.mineCount - game.flagCount} 💣</span>
      </div>
    </div>
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
