import * as React from "react";
import { Level, levels } from "../constants";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useHistory } from "../hooks/useHistory";
import { useStatistics } from "../hooks/useStatistics";
import { useTimer } from "../hooks/useTimer";
import { useUpdate } from "../hooks/useUpdate";
import { Change } from "../models/solver";
import { Cells } from "./Cells";
import { Solutions } from "./Solutions";
import { Statistics } from "./Statistics";
import { StatusBar } from "./StatusBar";
import { useSolutions } from "./useSolutions";
import { fullHeight, VH } from "./VH";

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [level, setLevel] = React.useState<Level>("easy");
  const [game, startGame] = useGame(update, levels.get("easy")!);
  useGameTimerControl(game, timer);

  const statistics = useStatistics(game, level, timer);

  const [history, goBack] = useHistory(game.grid);

  const solutions = useSolutions(game);

  const applySolutions = React.useCallback(
    (solutions: Change[]) =>
      solutions.forEach(([[x, y], action]) => game.onAction(x, y, action)),
    [game]
  );

  const [autoPlay, setAutoPlay] = React.useState(false);
  React.useEffect(() => {
    if (autoPlay && solutions.length) {
      let ran = false;
      const timeout = setTimeout(() => {
        ran = true
        applySolutions(solutions);
      }, 500);

      return () => {
        if (!ran) clearTimeout(timeout);
      };
    }
  }, [applySolutions, autoPlay, solutions]);

  return (
    <VH>
      <div className="viewport" style={{ height: fullHeight }}>
        <Statistics statistics={statistics} />
        <StatusBar
          time={timer.value}
          game={game}
          setLevel={setLevel}
          level={level}
          startGame={startGame}
        />
        <div>
          <label>
            <input
              type="checkbox"
              name="auto-play"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
            Auto play
          </label>
          <button
            disabled={game.state !== "playing" || history.length < 2}
            onClick={() => {
              goBack();
              const prevState = history[history.length - 2];
              if (prevState) game.setGrid(prevState);
            }}
          >
            Cancel
          </button>
        </div>
        <Cells game={game} solutions={solutions} />
        <Solutions solutions={solutions} apply={applySolutions} />
      </div>
    </VH>
  );
}
