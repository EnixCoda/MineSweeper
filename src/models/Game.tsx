import { Cell } from "./Cell";
import { Grid } from "./Grid";
import { Position } from "./Position";

export type Actions = BasicActions | "dig-surroundings";
export type BasicActions = "reveal" | "flag";

type TransformMap<
  State extends string,
  Action extends string,
  Args extends any[]
> = Partial<
  Record<State, Partial<Record<Action, (State | ((...args: Args) => void))[]>>>
>;

export class Game {
  readonly mineCount: number;
  public grid: Grid<Cell>;
  public state: "idle" | "playing" | "win" | "lose" = "idle";
  private onUpdate: () => void;
  constructor(
    width: Game["grid"]["width"],
    height: Game["grid"]["height"],
    mineCount: Game["mineCount"],
    onUpdate: Game["onUpdate"]
  ) {
    this.mineCount = Math.min(width * height - 1, mineCount);
    this.onUpdate = onUpdate;

    const cells: Cell[] = new Array(width * height)
      .fill(null)
      .map((_, i) => new Cell(i < this.mineCount));
    this.grid = new Grid(width, height, cells);
  }

  get flagCount(): number {
    let count = 0;
    this.grid.scan((_, cell) => {
      if (cell.state === "flagged") ++count;
    });
    return count;
  }

  private get unrevealedCount(): number {
    let unrevealed = this.grid.width * this.grid.height;
    this.grid.scan((_, cell) => {
      if (cell.state === "revealed") --unrevealed;
    });
    return unrevealed;
  }

  private setSurroundingsCount(position: Position) {
    const cell = this.grid.get(position);
    if (cell.isMine === false) {
      cell.surroundingsCount = this.grid
        .getSurroundings(position)
        .filter(([$position, $cell]) => $cell.isMine).length;
    }
  }

  beforeMutation() {
    this.grid = this.grid.clone();
  }

  onSafeReveal(position: Position) {
    do this.grid.shuffle();
    while (this.grid.get(position).isMine);
  }

  setGrid(grid: Game["grid"]) {
    this.grid = grid;
    this.onUpdate();
  }

  mutate(mutation: () => void) {
    this.beforeMutation();
    mutation();
    this.onUpdate();
  }

  onUIAction(position: Position, action: Actions) {
    this.mutate(() => this.onAction(position, action));
  }

  onAction(position: Position, action: Actions) {
    const cell = this.grid.get(position);
    if (action === "dig-surroundings") {
      if (cell.state !== "revealed") return;

      let countFlags = 0;
      const surroundings = this.grid.getSurroundings(position);
      surroundings.forEach(
        ([position, cell]) => (countFlags += cell.state === "flagged" ? 1 : 0)
      );
      if (countFlags !== cell.surroundingsCount) return;

      surroundings.forEach(([position]) =>
        this.onBaseAction(position, "reveal")
      );
    } else {
      this.onBaseAction(position, action);
    }
  }

  cellTransformMap: TransformMap<
    Cell["state"],
    BasicActions,
    [Position, Cell]
  > = {
    initial: {
      reveal: [
        "revealed",
        (position, cell) => {
          if (this.state === "idle") this.state = "playing";

          if (cell.isMine) this.state = "lose";
          else {
            if (this.unrevealedCount === this.mineCount) this.state = "win";
            this.setSurroundingsCount(position);
            if (cell.surroundingsCount === 0)
              this.grid
                .getSurroundings(position)
                .forEach(([$position]) =>
                  this.onBaseAction($position, "reveal")
                );
          }
        },
      ],
      flag: ["flagged"],
    },
    flagged: {
      flag: ["initial"],
    },
  };

  private onBaseAction(position: Position, action: BasicActions) {
    if (this.state === "idle" && action === "reveal")
      this.onSafeReveal(position);

    if (this.state === "win" || this.state === "lose") return;

    const cell = this.grid.get(position);
    const next = this.cellTransformMap[cell.state]?.[action];
    if (next) {
      next.forEach((transform) => {
        if (typeof transform === "string") cell.state = transform;
        else transform(position, cell);
      });
    }
  }
}
