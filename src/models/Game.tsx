import { Cell } from "./Cell";
import { Grid } from "./Grid";

type Actions = BasicActions | "macro";
type BasicActions = "reveal" | "flag";

type TransformMap<Data, State extends string, Action extends string> = Partial<
  Record<
    State,
    Partial<
      Record<Action, (State | ((x: number, y: number, data: Data) => void))[]>
    >
  >
>;

export class Game {
  readonly mineCount: number;
  readonly grid: Grid<Cell>;
  public state: "idle" | "playing" | "win" | "lose" = "idle";
  private onGameUpdate: () => void;
  private unrevealedCount: number;
  constructor(
    width: Game["grid"]["width"],
    height: Game["grid"]["height"],
    mineCount: Game["mineCount"],
    onGameUpdate: Game["onGameUpdate"]
  ) {
    this.grid = new Grid(width, height);
    this.mineCount = Math.min(width * height - 1, mineCount);
    this.onGameUpdate = onGameUpdate;
    this.unrevealedCount = width * height;

    let i = 0;
    while (i++ < this.mineCount) this.grid.randomInsert(new Cell(true));
    while (this.grid.randomInsert(new Cell(false)));
  }

  get flagCount(): number {
    let count = 0;
    this.grid.scan((x, y, cell) => {
      if (cell.state === "flagged") ++count;
    });
    return count;
  }

  private setSiblingsCount(x: number, y: number) {
    const cell = this.grid.get(x, y);
    if (cell.isMine === false) {
      cell.siblingsCount = this.grid
        .getSiblings(x, y)
        .filter(([x, y]) => this.grid.get(x, y).isMine).length;
    }
  }

  onSafeReveal(x: number, y: number) {
    while (this.grid.get(x, y).isMine) this.grid.randomSwap(x, y);
  }

  onAction(x: number, y: number, action: Actions) {
    const cell = this.grid.get(x, y);
    if (action === "macro") {
      if (cell.state !== "revealed") return;

      let countFlags = 0;
      const siblings = this.grid.getSiblings(x, y);
      siblings.forEach(
        ([$x, $y]) =>
          (countFlags += this.grid.get($x, $y).state === "flagged" ? 1 : 0)
      );
      if (countFlags !== cell.siblingsCount) return;

      siblings.forEach(([$x, $y]) => this.onBaseAction($x, $y, "reveal"));
    } else {
      this.onBaseAction(x, y, action);
    }
    this.onGameUpdate();
  }

  cellTransformMap: TransformMap<Cell, Cell["state"], BasicActions> = {
    initial: {
      reveal: [
        "revealed",
        (x, y, cell) => {
          if (this.state === "idle") this.state = "playing";
          if (--this.unrevealedCount === this.mineCount) this.state = "win";
          if (cell.isMine) this.state = "lose";
          else {
            this.setSiblingsCount(x, y);
            if (cell.siblingsCount === 0)
              this.grid
                .getSiblings(x, y)
                .forEach(([$x, $y]) => this.onBaseAction($x, $y, "reveal"));
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

    const cell = this.grid.get(x, y);
    const next = this.cellTransformMap[cell.state]?.[action];
    next?.forEach((transform) => {
      if (typeof transform === "string") cell.state = transform;
      else transform(x, y, cell);
    });
  }
}
