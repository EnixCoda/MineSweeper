import * as React from "react";
import { Cell } from "../models/Cell";

const digits = [
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  ["𝟎", "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", "𝟔", "𝟕", "𝟖", "𝟗"],
  ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"],
  ["𝟢", "𝟣", "𝟤", "𝟥", "𝟦", "𝟧", "𝟨", "𝟩", "𝟪", "𝟫"],
  ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"],
  ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"],
];

const themes: {
  digits: string[];
  flagged: string;
  mine: string;
  initial: string;
  revealed: string;
}[] = [
  {
    digits: digits[0],
    flagged: "⛳️",
    initial: "🟩",
    mine: "💣",
    revealed: " ",
  },
  {
    digits: digits[5],
    flagged: "⛳️",
    initial: "🟩",
    mine: "💣",
    revealed: "⬜️",
  },
  {
    digits: digits[4],
    flagged: "⛳️",
    initial: "⬜️",
    mine: "💣",
    revealed: " ",
  },
];

const theme = themes[1];
export function CellContent({ cell }: { cell: Cell }) {
  return (
    <span className="cell-content">
      <span className="emoji-center">
        {cell.state === "flagged"
          ? theme.flagged
          : cell.state === "initial"
          ? theme.initial
          : cell.state === "revealed"
          ? cell.isMine
            ? theme.mine
            : cell.mines > 0
            ? theme.digits[cell.mines]
            : theme.revealed
          : ""}
      </span>
    </span>
  );
}
