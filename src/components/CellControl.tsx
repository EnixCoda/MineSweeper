import * as React from "react";
import { pointerEventButtons } from "../constants";
import { Game } from "../models/Game";
import { CellContent } from "./CellContent";

export function CellControl({ game, x, y }: { game: Game; x: number; y: number }) {
  const cell = game.grid.get(x, y);
  const ref = React.useRef({ left: false, right: false });
  const cellState = cell?.state || "";
  return (
    <div
      className={`cell state-${cellState}`}
      role="button"
      onContextMenu={(e) => e.preventDefault()}
      onPointerUp={(e) => {
        if (e.buttons === 0) {
          const { left, right } = ref.current;
          const action =
            left && right ? "macro" : left ? "reveal" : right ? "flag" : "";
          if (action !== "") game.onAction(x, y, action);
          ref.current.left = false;
          ref.current.right = false;
        }
      }}
      onPointerMove={(e) => {
        if (e.buttons === 0) return;
        if (e.buttons & pointerEventButtons.LEFT) ref.current.left = true;
        if (e.buttons & pointerEventButtons.RIGHT) ref.current.right = true;
      }}
      onPointerDown={(e) => {
        if (e.buttons & pointerEventButtons.LEFT) ref.current.left = true;
        if (e.buttons & pointerEventButtons.RIGHT) ref.current.right = true;
      }}
      title={`[${x},${y}] ${cellState}`}
    >
      <CellContent cell={cell} />
    </div>
  );
}
