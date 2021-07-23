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

const enableTimeTravel = false;
const showSolutions = false;

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [level, setLevel] = React.useState<Level>("easy");
  const [game, startGame] = useGame(update, levels.get("easy")!);
  useGameTimerControl(game, timer);

  const statistics = useStatistics(game, level, timer);

  const [history, goBack] = useHistory(game.grid);

  const [showHint, setShowHint] = React.useState(false);

  const solutions = useSolutions(game);
  const applySolutions = React.useCallback(
    (solutions: Change[]) => {
      game.mutate(() =>
        solutions.forEach(([[x, y], action]) => game.onAction(x, y, action))
      );
    },
    [game]
  );

  const [autoPlay, setAutoPlay] = React.useState(false);
  React.useEffect(() => {
    if (autoPlay && solutions.length) {
      let ran = false;
      const timeout = setTimeout(() => {
        if (ran) return;
        ran = true;
        applySolutions(solutions);
      }, 0 * 100);

      return () => {
        if (!ran) clearTimeout(timeout);
      };
    }
  }, [applySolutions, autoPlay, solutions]);

  const $solutions = React.useMemo(
    () => (autoPlay || showHint ? solutions : []),
    [autoPlay, showHint, solutions]
  );

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
          <label>
            <input
              type="checkbox"
              name="show-hint"
              checked={showHint}
              onChange={(e) => setShowHint(e.target.checked)}
            />
            Show Hint
          </label>
          {enableTimeTravel && (
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
          )}
        </div>
        <Cells game={game} solutions={$solutions} />
        {showSolutions && (
          <Solutions solutions={solutions} apply={applySolutions} />
        )}
      </div>
    </VH>
  );
}
