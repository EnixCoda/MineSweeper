import * as React from "react";
import { Game } from "../models/Game";
import { allLevelLabels, customLevel, Level } from "../models/Level";
import { useStorage } from "./useStorage";

export type LevelStatistics = {
  total: number;
  wins: number;
  records: number[];
};

export type Statistics = Record<Level, LevelStatistics>;

export function useStatistics(
  game: Game,
  level: Level,
  time: number,
  autoPlay: boolean
) {
  const [statistics, updateStatistics] = useStorage(
    "statistics",
    allLevelLabels.reduce(
      (statistics, level) => ({
        ...statistics,
        [level]: { total: 0, wins: 0, records: [] },
      }),
      {} as Statistics
    )
  );

  React.useEffect(() => {
    if (level === customLevel) return;
    if (autoPlay) return;
    // mutating
    switch (game.state) {
      case "lose": {
        statistics[level].total++;
        break;
      }
      case "win": {
        statistics[level].wins++;
        statistics[level].total++;
        statistics[level].records.push(time);
        statistics[level].records.sort((a, b) => a - b).splice(3, Infinity);
        break;
      }
    }
    updateStatistics(statistics);
  }, [level, game.state, autoPlay]);

  return statistics;
}
