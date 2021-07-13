export const pointerEventButtons = {
  LEFT: 0b1,
  RIGHT: 0b10,
  MIDDLE: 0b100,
};

export const levels = {
  easy: [9, 9, 10],
  medium: [16, 16, 40],
  hard: [30, 16, 99],
  oneChanceToLive: [10, 10, 99],
} as const;

export type Level = keyof typeof levels;
