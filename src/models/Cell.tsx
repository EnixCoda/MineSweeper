import { Immutable } from "./Immutable";

export class Cell implements Immutable<Cell> {
  readonly isMine: boolean;
  state: "initial" | "flagged" | "revealed" = "initial";
  mines: number;

  clone() {
    return new Cell(this.isMine, this.mines, this.state);
  }

  constructor(
    isMine: Cell["isMine"],
    mines: Cell["mines"] = 0,
    state: Cell["state"] = "initial"
  ) {
    this.isMine = isMine;
    this.mines = mines;
    this.state = state;
  }
}
