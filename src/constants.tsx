export const pointerEventButtons = {
  LEFT: 0b1,
  RIGHT: 0b10,
  MIDDLE: 0b100,
};

export const levels = new Map([
  ["easy", { width: 9, height: 9, mines: 10 }],
  ["medium", { width: 16, height: 16, mines: 40 }],
  ["hard", { width: 30, height: 16, mines: 99 }],
  ["oneChanceToLive", { width: 10, height: 10, mines: 99 }],
] as const);

type MapKeys<M> = M extends Map<infer K, infer V> ? K : never;
type MapValues<M> = M extends Map<infer K, infer V> ? V : never;

export type Level = MapKeys<typeof levels>;
