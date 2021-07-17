import * as React from "react";
import { Cell } from "../models/Cell";

export function CellSiblingsCount({ cell }: { cell: Cell }) {
  return <span>{cell.siblingsCount || null}</span>;
}

export function CellMine() {
  return <span>💣</span>;
}

export function CellInitial() {
  return <span>🟩</span>;
}

export function CellFlagged() {
  return <span>⛳️</span>;
}

export function CellContent({ cell }: { cell: Cell }) {
  return (
    <span className="emoji-center">
      {cell.state === "flagged" ? (
        <CellFlagged />
      ) : cell.state === "initial" ? (
        <CellInitial />
      ) : cell.state === "revealed" ? (
        cell.isMine ? (
          <CellMine />
        ) : (
          <CellSiblingsCount cell={cell} />
        )
      ) : (
        ""
      )}
    </span>
  );
}
