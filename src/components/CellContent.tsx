import * as React from "react";
import { Cell } from "../models/Cell";

export function CellSurroundingsCount({ cell }: { cell: Cell }) {
  return <span>{cell.surroundingsCount || null}</span>;
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
    <span className={`cell-content emoji-center`}>
      {cell.state === "flagged" ? (
        <CellFlagged />
      ) : cell.state === "initial" ? (
        <CellInitial />
      ) : cell.state === "revealed" ? (
        cell.isMine ? (
          <CellMine />
        ) : (
          <CellSurroundingsCount cell={cell} />
        )
      ) : (
        ""
      )}
    </span>
  );
}
