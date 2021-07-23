export type Position = [number, number];

export function matchPositions(a: Position, b: Position) {
  const [aX, aY] = a;
  const [bX, bY] = b;
  return aX === bX && aY === bY;
}
