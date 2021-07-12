export class Cell {
  readonly isMine: boolean;
  state: "initial" | "flagged" | "revealed" = "initial";
  siblingsCount: number;

  constructor(
    isMine: Cell["isMine"],
    siblingsCount: Cell["siblingsCount"] = 0
  ) {
    this.isMine = isMine;
    this.siblingsCount = siblingsCount;
  }
}
