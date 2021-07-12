import * as React from "react";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useTimer } from "../hooks/useTimer";
import { useUpdate } from "../hooks/useUpdate";
import { CellControl } from "./CellControl";

const levels = {
  easy: [9, 9, 10],
  medium: [16, 16, 40],
  hard: [30, 16, 99],
} as const;

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [game, startGame] = useGame(update);
  useGameTimerControl(game, timer);
  const [level, setLevel] = React.useState<keyof typeof levels>("easy");

  let i = 0;
  return (
    <div className="viewport">
      <div className="status-bar">
        <pre>
          Time:{" "}
          {Math.min(999, timer.value / 1000)
            .toFixed(1)
            .padStart(5, "0")}
        </pre>
        {game.state}
        <div>
          <select
            name="level"
            onChange={(e) => setLevel(e.target.value as keyof typeof levels)}
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
      <div className="cells-view">
        <div
          className="cells-container"
          style={{
            gridTemplateColumns: `repeat(${game.grid.width}, 32px)`,
            gridTemplateRows: `repeat(${game.grid.height}, 32px)`,
          }}
        >
          {game.grid.map((x, y) => (
            <CellControl key={i++} game={game} x={x} y={y} />
          ))}
        </div>
      </div>
    </div>
  );
}
