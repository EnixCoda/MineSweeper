import * as React from "react";
import { Level, levels } from "../constants";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useStatistics } from "../hooks/useStatistics";
import { useTimer } from "../hooks/useTimer";
import { useUpdate } from "../hooks/useUpdate";
import { Cells } from "./Cells";
import { Statistics } from "./Statistics";

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [game, startGame] = useGame(update);
  useGameTimerControl(game, timer);

  const [level, setLevel] = React.useState<Level>("easy");
  const statistics = useStatistics(game, level, timer);

  return (
    <div className="viewport">
      <div className="status-bar">
        <pre>Time: {formatTime(timer.value)}</pre>
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
      <Statistics statistics={statistics} />
      <Cells game={game} />
    </div>
  );
}
