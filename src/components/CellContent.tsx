import * as React from "react";
import { Cell } from "../models/Cell";

const digits = [
  ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  ["𝟎", "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", "𝟔", "𝟕", "𝟖", "𝟗"],
  ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"],
  ["𝟢", "𝟣", "𝟤", "𝟥", "𝟦", "𝟧", "𝟨", "𝟩", "𝟪", "𝟫"],
  ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"],
  ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"],
];

export function CellSurroundingsCount({ cell }: { cell: Cell }) {
  return (
    <span>
      {cell.surroundingsCount > 0 ? digits[0][cell.surroundingsCount] : "⬜️"}
    </span>
  );
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

export const CellContent = React.memo(function CellContent({
  cell,
}: {
  cell: Cell;
}) {
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
});
