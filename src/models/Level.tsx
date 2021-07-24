export const customLevel = "custom";

export type LevelSetting = { width: number; height: number; mines: number };

export const levels = new Map([
  ["easy", { width: 9, height: 9, mines: 10 } as LevelSetting],
  ["medium", { width: 16, height: 16, mines: 40 } as LevelSetting],
  ["hard", { width: 30, height: 16, mines: 99 } as LevelSetting],
  [customLevel, { width: 10, height: 10, mines: 99 } as LevelSetting],
] as const);

export const allLevelLabels = Array.from(levels.keys());
export const levelLabels = allLevelLabels.filter(
  (level) => level !== customLevel
);

type MapKeys<M> = M extends Map<infer K, infer V> ? K : never;
type MapValues<M> = M extends Map<infer K, infer V> ? V : never;

export type Level = MapKeys<typeof levels>;
