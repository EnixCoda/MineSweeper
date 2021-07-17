import * as React from "react";
import { Level, levels } from "../constants";
import { Game } from "../models/Game";
import { formatTime } from "../utils";

export function StatusBar({
  time, game, level, setLevel, startGame,
}: {
  time: number;
  game: Game;
  level: Level;
  setLevel: (level: Level) => void;
  startGame: (width: number, height: number, mines: number) => void;
}) {
  return (
    <div className="status-bar">
      <pre>Time: {formatTime(time)}</pre>
      {game.state}
      <div>
        <select
          name="level"
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          {Object.keys(levels).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const [width, height, mines] = levels[level];
            return startGame(width, height, mines);
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
