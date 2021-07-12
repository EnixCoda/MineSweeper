import * as React from "react";
import { Cell } from "../models/Cell";

export function CellSiblingsCount(cell: Cell): React.ReactNode {
  return cell.siblingsCount;
}

export function CellMine(): React.ReactNode {
  return "💣";
}

export function CellInitial(): React.ReactNode {
  return "🟩";
}

export function CellFlagged(): React.ReactNode {
  return "⛳️";
}

export function CellContent({ cell }: { cell: Cell }) {
  return (
    <>
      {cell.state === "flagged"
        ? CellFlagged()
        : cell.state === "initial"
        ? CellInitial()
        : cell.state === "revealed"
        ? cell.isMine
          ? CellMine()
          : CellSiblingsCount(cell) || null
        : ""}
    </>
  );
}
