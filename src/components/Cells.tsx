import * as React from "react";
import { pointerEventButtons } from "../constants";
import { Actions, BasicActions, Game } from "../models/Game";
import {
  matchPositions,
  Position,
  rangeDistanceBetween
} from "../models/Position";
import { Solution } from "../models/solver";
import { CellContent } from "./CellContent";

export const Cells = React.memo(function Cells({
  game,
  defaultAction,
  solutions,
}: {
  game: Game;
  defaultAction: BasicActions;
  solutions: Solution[];
}) {
  const ref = React.useRef({ left: false, right: false });
  const [pointer, updatePointer] = React.useState<Position>([-1, -1]);
  const [action, setAction] = React.useState<Actions | null>(null);
  const fireAction = React.useCallback(
    function fireAction(position: Position) {
      const { left, right } = ref.current;
      const action =
        left && right
          ? "dig-surroundings"
          : left
          ? defaultAction
          : right
          ? "flag"
          : null;
      setAction(action);
      if (action === null) return;
      game.onUIAction(position, action);
    },
    [game, game.onUIAction, defaultAction]
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent, position: Position) => {
      updatePointer(position);
      fireAction(position);
      ref.current.left = false;
      ref.current.right = false;
    },
    [fireAction]
  );
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent, position: Position) => {
      updatePointer(position);
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
    (e: React.PointerEvent, position: Position) => {
      updatePointer(position);
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
        {game.grid.map((position, cell) => (
          <div
            key={i++}
            className={`cell state-${cell.state} pointer-${resolveCellClass(
              action,
              position,
              pointer
            )} solution-${
              solutions.find(([$position]) =>
                matchPositions(position, $position)
              )?.[1] || ""
            }`}
            role="button"
            onContextMenu={(e) => e.preventDefault()}
            onPointerUp={(e) => onPointerUp(e, position)}
            onPointerMove={(e) => onPointerMove(e, position)}
            onPointerDown={(e) => onPointerDown(e, position)}
          >
            <CellContent cell={cell} />
          </div>
        ))}
      </div>
    </div>
  );
});

function resolveCellClass(
  action: Actions | null,
  cellPosition: Position,
  pointer: Position
) {
  switch (action) {
    case "reveal": {
      if (matchPositions(cellPosition, pointer)) return "reveal";
      break;
    }
    case "dig-surroundings": {
      if (rangeDistanceBetween(cellPosition, pointer) <= 1)
        return "dig-surroundings";
      break;
    }
  }

  if (matchPositions(cellPosition, pointer)) return "hover";

  return "";
}
