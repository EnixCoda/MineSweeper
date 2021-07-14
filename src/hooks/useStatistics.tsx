import * as React from "react";
import { Level, levels } from "../constants";
import { Game } from "../models/Game";
import { useStorage } from "./useStorage";

export type Statistics = Record<
  Level,
  {
    total: number;
    wins: number;
    records: number[];
  }
>;

export function useStatistics(
  game: Game,
  level: Level,
  timer: {
    value: number;
    mutations: { start(): void; pause(): void; reset(): void };
  }
) {
  const [statistics, updateStatistics] = useStorage(
    "statistics",
    Object.keys(levels).reduce(
      (statistics, level) => ({
        ...statistics,
        [level]: { total: 0, wins: 0, records: [] },
      }),
      {} as Statistics
    )
  );

  React.useEffect(() => {
    // mutating
    switch (game.state) {
      case "lose": {
        statistics[level].total++;
        break;
      }
      case "win": {
        statistics[level].wins++;
        statistics[level].total++;
        statistics[level].records.push(timer.value);
        statistics[level].records.sort((a, b) => a - b).splice(3, Infinity);
        break;
      }
    }
    updateStatistics(statistics);
  }, [game.state]);

  return statistics;
}
