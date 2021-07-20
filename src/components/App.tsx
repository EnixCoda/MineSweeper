import * as React from "react";
import { Level, levels } from "../constants";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useHistory } from "../hooks/useHistory";
import { useStatistics } from "../hooks/useStatistics";
import { useTimer } from "../hooks/useTimer";
import { useUpdate } from "../hooks/useUpdate";
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
        <Solutions
          solutions={solutions}
          apply={(solutions) => {
            solutions.forEach(([[x, y], action]) =>
              game.onAction(x, y, action)
            );
          }}
        />
      </div>
    </VH>
  );
}
