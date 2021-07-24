export type Position = [number, number];

export function matchPositions(a: Position, b: Position) {
  const [aX, aY] = a;
  const [bX, bY] = b;
  return aX === bX && aY === bY;
}

export function rangeDistanceBetween(a: Position, b: Position) {
  const [aX, aY] = a;
  const [bX, bY] = b;
  return Math.max(Math.abs(aX - bX), Math.abs(aY - bY));
}
