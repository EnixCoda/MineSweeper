import { clone, Immutable } from "./Immutable";
import { Position } from "./Position";

export class Grid<T> implements Immutable<Grid<T>> {
  readonly width: number;
  readonly height: number;
  readonly size: number;
  private slots: T[] = [];

  clone() {
    return new Grid<T>(
      this.width,
      this.height,
      this.slots.map((slot) => clone(slot))
    );
  }

  constructor(
    width: Grid<T>["width"],
    height: Grid<T>["height"],
    slots: Grid<T>["slots"]
  ) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.slots = slots;
  }

  private i([x, y]: Position) {
    return x + this.width * y;
  }

  private xy(i: number): Position {
    const x = i % this.width;
    const y = (i - x) / this.width;
    return [x, y];
  }

  get(position: Position) {
    return this.slots[this.i(position)];
  }

  set(position: Position, data: T) {
    this.slots[this.i(position)] = data;
  }

  getSurroundings([x, y]: Position, range = 1) {
    const surroundings: [Position, T][] = [];
    for (let dx = -range; dx <= range; ++dx) {
      const $x = x + dx;
      if ($x < 0 || $x >= this.width) continue;
      for (let dy = -range; dy <= range; ++dy) {
        const $y = y + dy;
        if ($y < 0 || $y >= this.height) continue;

        if (dx === 0 && dy === 0) continue;
        const position: Position = [$x, $y];
        surroundings.push([position, this.get(position)]);
      }
    }
    return surroundings;
  }

  shuffle() {
    const slots: T[] = [];
    let i = 0;
    while (i < this.size) {
      let index = Math.floor(Math.random() * this.size);
      while (slots[index] !== undefined) index = (index + 1) % this.size;
      slots[index] = this.slots[i];
      ++i;
    }

    this.slots.forEach((_, i) => (this.slots[i] = slots[i]));
  }

  scan(callback: (position: Position, slot: T) => void) {
    let i = 0;
    while (i < this.size) {
      const position = this.xy(i++);
      callback(position, this.get(position));
    }
  }

  map<X>(callback: (position: Position, slot: T) => X): X[] {
    const result: X[] = [];
    this.scan((position, slot) => result.push(callback(position, slot)));
    return result;
  }
}
