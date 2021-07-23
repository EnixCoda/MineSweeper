import { Immutable } from "./Immutable";

export class Cell implements Immutable<Cell> {
  readonly isMine: boolean;
  state: "initial" | "flagged" | "revealed" = "initial";
  surroundingsCount: number;

  clone() {
    return new Cell(this.isMine, this.surroundingsCount, this.state);
  }

  constructor(
    isMine: Cell["isMine"],
    surroundingsCount: Cell["surroundingsCount"] = 0,
    state: Cell["state"] = "initial"
  ) {
    this.isMine = isMine;
    this.surroundingsCount = surroundingsCount;
    this.state = state;
  }
}
