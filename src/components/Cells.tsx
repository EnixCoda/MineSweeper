import * as React from "react";
import { pointerEventButtons } from "../constants";
import { Game } from "../models/Game";
import { CellContent } from "./CellContent";

export function Cells({ game }: { game: Game }) {
  const ref = React.useRef({ left: false, right: false });
  const fireAction = React.useCallback(
    function fireAction(x: number, y: number) {
      const { left, right } = ref.current;
      const action =
        left && right ? "macro" : left ? "reveal" : right ? "flag" : "";
      if (action === "") return;
      game.onAction(x, y, action);
    },
    [game.onAction]
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerUp`, e.buttons, ref.current);
      fireAction(x, y);
      ref.current.left = false;
      ref.current.right = false;
    },
    [fireAction]
  );
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerMove`, e.buttons, ref.current);
      if (e.buttons === 0) return;
      ref.current.left ||= Boolean(e.buttons & pointerEventButtons.LEFT);
      ref.current.right ||= Boolean(e.buttons & pointerEventButtons.RIGHT);
    },
    []
  );
  const onPointerDown = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerDown`, e.buttons, ref.current);
      if (e.buttons === 0) return;
      ref.current.left ||= Boolean(e.buttons & pointerEventButtons.LEFT);
      ref.current.right ||= Boolean(e.buttons & pointerEventButtons.RIGHT);
    },
    []
  );

  let i = 0;
  return (
    <div className="cells-view">
      <div
        className="cells-container"
        style={{
          gridTemplateColumns: `repeat(${game.grid.width}, 32px)`,
          gridTemplateRows: `repeat(${game.grid.height}, 32px)`,
        }}
      >
        {game.grid.map((x, y) => {
          const cell = game.grid.get(x, y);
          return (
            <div
              key={i++}
              className={`cell state-${cell.state}`}
              role="button"
              onContextMenu={(e) => e.preventDefault()}
              onPointerUp={(e) => onPointerUp(e, x, y)}
              onPointerMove={(e) => onPointerMove(e, x, y)}
              onPointerDown={(e) => onPointerDown(e, x, y)}
              title={`[${x},${y}] ${cell.state}`}
            >
              <CellContent cell={cell} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
