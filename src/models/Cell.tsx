import { Immutable } from "./Immutable";

export class Cell implements Immutable<Cell> {
  readonly isMine: boolean;
  state: "initial" | "flagged" | "revealed" = "initial";
  siblingsCount: number;

  clone() {
    return new Cell(this.isMine, this.siblingsCount, this.state);
  }

  constructor(
    isMine: Cell["isMine"],
    siblingsCount: Cell["siblingsCount"] = 0,
    state: Cell["state"] = "initial"
  ) {
    this.isMine = isMine;
    this.siblingsCount = siblingsCount;
    this.state = state;
  }
}
