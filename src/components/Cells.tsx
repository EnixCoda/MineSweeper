import * as React from "react";
import { pointerEventButtons } from "../constants";
import { Actions, BasicActions, Game } from "../models/Game";
import { matchPositions, Position } from "../models/Position";
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
  const actionAffectedPositions = React.useMemo(
    () =>
      action === "dig-surroundings"
        ? game.grid.getSurroundings(pointer).map(([position]) => position)
        : [pointer],
    [action, pointer, game.grid]
  );
  const lastDigTime = React.useRef(0);
  const doubleDigToDigSurroundingsTimeThreshold = 300;
  const updateAction = React.useCallback(() => {
    const { left, right } = ref.current;
    const action: Actions | null =
      left && right
        ? "dig-surroundings"
        : left
        ? defaultAction
        : right
        ? "flag"
        : null;
    setAction(action);
    return action;
  }, [defaultAction]);
  const fireAction = React.useCallback(
    function fireAction(position: Position) {
      let action = updateAction();
      if (action === null) return;

      if (action === "reveal") {
        if (
          Date.now() - lastDigTime.current <
          doubleDigToDigSurroundingsTimeThreshold
        ) {
          action = "dig-surroundings";
        }
        lastDigTime.current = Date.now();
      }
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
      updateAction();
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
      updateAction();
    },
    []
  );
  const onPointerDown = React.useCallback(
    (e: React.PointerEvent, position: Position) => {
      updatePointer(position);
      if (e.buttons === 0) return;
      ref.current.left ||= Boolean(e.buttons & pointerEventButtons.LEFT);
      ref.current.right ||= Boolean(e.buttons & pointerEventButtons.RIGHT);
      updateAction();
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
            className={`cell state-${cell.state} pointer-${
              action &&
              actionAffectedPositions.some(($position) =>
                matchPositions(position, $position)
              )
                ? action
                : ""
            } solution-${
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
