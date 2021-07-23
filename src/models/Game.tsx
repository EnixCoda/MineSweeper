import { Cell } from "./Cell";
import { Grid } from "./Grid";

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
    this.grid.shuffle();
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

  private setSurroundingsCount(x: number, y: number) {
    const cell = this.grid.get([x, y]);
    if (cell.isMine === false) {
      cell.surroundingsCount = this.grid
        .getSurroundings([x, y])
        .filter(([position, cell]) => cell.isMine).length;
    }
  }

  setGrid(grid: Game["grid"]) {
    this.grid = grid;
    this.onUpdate();
  }

  onSafeReveal(x: number, y: number) {
    while (this.grid.get([x, y]).isMine) this.grid.shuffle();
  }

  onAction(x: number, y: number, action: Actions) {
    const cell = this.grid.get([x, y]);
    if (action === "dig-surroundings") {
      if (cell.state !== "revealed") return;

      let countFlags = 0;
      const surroundings = this.grid.getSurroundings([x, y]);
      surroundings.forEach(
        ([position, cell]) => (countFlags += cell.state === "flagged" ? 1 : 0)
      );
      if (countFlags !== cell.surroundingsCount) return;

      this.setGrid(this.grid.clone());
      surroundings.forEach(([[x, y]]) => this.onBaseAction(x, y, "reveal"));
    } else {
      this.setGrid(this.grid.clone());
      this.onBaseAction(x, y, action);
    }
  }

  cellTransformMap: TransformMap<
    Cell["state"],
    BasicActions,
    [number, number, Cell]
  > = {
    initial: {
      reveal: [
        "revealed",
        (x, y, cell) => {
          if (this.state === "idle") this.state = "playing";

          if (cell.isMine) this.state = "lose";
          else {
            if (this.unrevealedCount === this.mineCount) this.state = "win";
            this.setSurroundingsCount(x, y);
            if (cell.surroundingsCount === 0)
              this.grid
                .getSurroundings([x, y])
                .forEach(([[$x, $y]]) => this.onBaseAction($x, $y, "reveal"));
          }
        },
      ],
      flag: ["flagged"],
    },
    flagged: {
      flag: ["initial"],
    },
  };

  private onBaseAction(x: number, y: number, action: BasicActions) {
    if (this.state === "idle" && action === "reveal") this.onSafeReveal(x, y);

    if (this.state === "win" || this.state === "lose") return;

    const cell = this.grid.get([x, y]);
    const next = this.cellTransformMap[cell.state]?.[action];
    if (next) {
      next.forEach((transform) => {
        if (typeof transform === "string") cell.state = transform;
        else transform(x, y, cell);
      });

      this.onUpdate();
    }
  }
}
