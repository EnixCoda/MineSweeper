import * as React from "react";
import { pointerEventButtons } from "../constants";
import { Game } from "../models/Game";
import { matchPositions } from "../models/Position";
import { Solution } from "../models/solver";
import { CellContent } from "./CellContent";

export function Cells({
  game,
  solutions,
}: {
  game: Game;
  solutions: Solution[];
}) {
  const ref = React.useRef({ left: false, right: false });
  const [pointer, updatePointer] = React.useState<[number, number]>([-1, -1]);
  const fireAction = React.useCallback(
    function fireAction(x: number, y: number) {
      const action = resolveAction(ref.current);
      if (action === "") return;
      game.onAction(x, y, action);
    },
    [game, game.onAction]
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerUp`, e.buttons, ref.current);
      updatePointer([x, y]);
      fireAction(x, y);
      ref.current.left = false;
      ref.current.right = false;
    },
    [fireAction]
  );
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerMove`, e.buttons, ref.current);
      updatePointer([x, y]);
      if (e.buttons === 0) {
        ref.current.left = false;
        ref.current.right = false;
        return;
      }
      ref.current.left ||= Boolean(e.buttons & pointerEventButtons.LEFT);
      ref.current.right ||= Boolean(e.buttons & pointerEventButtons.RIGHT);
    },
    []
  );
  const onPointerDown = React.useCallback(
    (e: React.PointerEvent, x: number, y: number) => {
      console.debug(`onPointerDown`, e.buttons, ref.current);
      updatePointer([x, y]);
      if (e.buttons === 0) return;
      ref.current.left ||= Boolean(e.buttons & pointerEventButtons.LEFT);
      ref.current.right ||= Boolean(e.buttons & pointerEventButtons.RIGHT);
    },
    []
  );

  let i = 0;
  return (
    <div className={`cells-view state-${game.state}`}>
      <div
        className="cells-container"
        style={{
          gridTemplateColumns: `repeat(${game.grid.width}, 32px)`,
          gridTemplateRows: `repeat(${game.grid.height}, 32px)`,
        }}
      >
        {game.grid.map(([x, y]) => {
          const cell = game.grid.get([x, y]);
          const solution = solutions.find(([[$x, $y]]) =>
            matchPositions([x, y], [$x, $y])
          );
          return (
            <div
              key={i++}
              className={`cell state-${cell.state} pointer-${resolveCellClass(
                ref.current,
                [x, y],
                pointer
              )} solution-${solution?.[1] || ""}`}
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

function resolveAction(ref: { left: boolean; right: boolean }) {
  const { left, right } = ref;
  const action =
    left && right ? "dig-surroundings" : left ? "reveal" : right ? "flag" : "";
  return action;
}

function resolveCellClass(
  ref: { left: boolean; right: boolean },
  cellPosition: [number, number],
  pointer: [number, number]
) {
  const action = resolveAction(ref);
  switch (action) {
    case "reveal": {
      if (cellPosition[0] === pointer[0] && cellPosition[1] === pointer[1])
        return "reveal";
      break;
    }
    case "dig-surroundings": {
      if (
        Math.abs(cellPosition[0] - pointer[0]) <= 1 &&
        Math.abs(cellPosition[1] - pointer[1]) <= 1
      )
        return "dig-surroundings";
      break;
    }
  }

  if (cellPosition[0] === pointer[0] && cellPosition[1] === pointer[1])
    return "hover";

  return "";
}
