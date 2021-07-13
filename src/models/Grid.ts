export class Grid<T> {
  readonly width: number;
  readonly height: number;
  private size: number;
  private slots: T[] = [];
  private occupiedSlots = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;
  }

  private i(x: number, y: number) {
    return x + this.width * y;
  }

  private xy(i: number) {
    const x = i % this.width;
    const y = (i - x) / this.width;
    return [x, y] as const;
  }

  get(x: number, y: number) {
    return this.slots[this.i(x, y)];
  }

  set(x: number, y: number, data: T) {
    return this._set(this.i(x, y), data);
  }

  private _set(index: number, data: T) {
    if (this.slots[index] === undefined) ++this.occupiedSlots;
    this.slots[index] = data;
  }

  getSibling(x: number, y: number, direction: Direction) {
    const dx = direction.includes("left")
      ? -1
      : direction.includes("right")
      ? 1
      : 0;
    const dy = direction.includes("top")
      ? -1
      : direction.includes("bottom")
      ? 1
      : 0;
    return this.get(x + dx, y + dy);
  }

  getSiblings(x: number, y: number) {
    const siblings: [number, number][] = [];
    for (let dx = -1; dx <= 1; ++dx) {
      for (let dy = -1; dy <= 1; ++dy) {
        if (!dx && !dy) continue;
        const $x = x + dx;
        const $y = y + dy;
        if ($x >= 0 && $x < this.width && $y >= 0 && $y < this.height)
          siblings.push([$x, $y]);
      }
    }
    return siblings;
  }

  randomInsert(data: T) {
    if (this.occupiedSlots === this.size) return false;
    let index = Math.floor(Math.random() * this.size);
    while (this.slots[index] !== undefined) index = (index + 1) % this.size;
    this._set(index, data);
    return true;
  }

  randomSwap(x: number, y: number) {
    const i = this.i(x, y);
    let j = Math.floor(Math.random() * this.size);
    if (i === j) j = (j + 1) % this.size;
    const tmp = this.slots[i];
    this.slots[i] = this.slots[j];
    this.slots[j] = tmp;
  }

  scan(callback: (x: number, y: number) => void) {
    let i = 0;
    while (i < this.size) callback(...this.xy(i++));
  }

  map<X>(callback: (x: number, y: number) => X): X[] {
    const r: X[] = [];
    this.scan((x, y) => r.push(callback(x, y)));
    return r;
  }
}

type DirectionVertical = "top" | "bottom";
type DirectionHorizontal = "left" | "right";
type Direction =
  | DirectionVertical
  | DirectionHorizontal
  | `${DirectionVertical}|${DirectionHorizontal}`;
