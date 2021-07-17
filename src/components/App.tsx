import * as React from "react";
import { Level } from "../constants";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useStatistics } from "../hooks/useStatistics";
import { useTimer } from "../hooks/useTimer";
import { useUpdate } from "../hooks/useUpdate";
import { Cells } from "./Cells";
import { Statistics } from "./Statistics";
import { StatusBar } from "./StatusBar";
import { fullHeight, VH } from "./VH";

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [game, startGame] = useGame(update);
  useGameTimerControl(game, timer);

  const [level, setLevel] = React.useState<Level>("easy");
  const statistics = useStatistics(game, level, timer);

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
        <Cells game={game} />
      </div>
    </VH>
  );
}
