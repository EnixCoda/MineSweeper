import { useCallbackRef } from "@chakra-ui/react";
import * as React from "react";
import { pointerEventButtons } from "../constants";
import { useKeyboardEvents } from "../hooks/useKeyboardHold";
import { Cell } from "../models/Cell";
import { Actions, BasicActions, Game } from "../models/Game";
import { matchPositions, Position } from "../models/Position";
import { Solution } from "../models/solver";
import { customDiff } from "../utils";
import { CellContent } from "./CellContent";

export const Cells = React.memo(function Cells({
  game,
  grid,
  defaultAction,
  solutions,
}: {
  game: Game;
  grid: Game["grid"]; // unused prop for triggering in-time re-render
  defaultAction: BasicActions;
  solutions: Solution[];
}) {
  const ref = React.useRef({ left: false, right: false });
  const [pointer, updatePointer] = React.useState<Position>([-1, -1]);
  useKeyboardEvents(
    "d",
    React.useCallback(() => game.onUIAction(pointer, "reveal"), [pointer])
  );
  useKeyboardEvents(
    "f",
    React.useCallback(() => game.onUIAction(pointer, "flag"), [pointer])
  );
  useKeyboardEvents(
    " ",
    React.useCallback(
      (e) => {
        e.preventDefault(); // prevent page scrolling
        game.mutate(() => {
          game.onAction(pointer, "dig-surroundings")
          grid
            .getSurroundings(pointer)
            .forEach(([position, cell]) =>
              game.onAction(position, "dig-surroundings")
            );
        });
      },
      [pointer]
    )
  );

  const [action, setAction] = React.useState<Actions | null>(null);
  const actionAffectedPositions = React.useMemo(
    () =>
      action === "dig-surroundings"
        ? game.grid.getSurroundings(pointer).map(([position]) => position)
        : [pointer],
    [action, pointer, game.grid]
  );
  const lastDig = React.useRef<{ time: number; position: Position }>({
    time: 0,
    position: [-1, -1],
  });
  const doubleDigToDigSurroundingsTimeThreshold = 300;
  const updateAction = useCallbackRef(() => {
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
  const fireAction = useCallbackRef(
    function fireAction(position: Position) {
      let action = updateAction();
      if (action === null) return;

      if (action === "reveal") {
        if (
          Date.now() - lastDig.current.time <
            doubleDigToDigSurroundingsTimeThreshold &&
          matchPositions(lastDig.current.position, position)
        ) {
          action = "dig-surroundings";
        }
        lastDig.current = {
          time: Date.now(),
          position,
        };
      }
      game.onUIAction(position, action);
    },
    [game, game.onUIAction, updateAction]
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent, position: Position) => {
      updatePointer(position);
      fireAction(position);
      ref.current.left = false;
      ref.current.right = false;
      updateAction();
    },
    []
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
          <CellContentWrapper
            key={i++}
            position={position}
            cell={cell}
            pointerActionState={
              action &&
              actionAffectedPositions.some(($position) =>
                matchPositions(position, $position)
              )
                ? action
                : ""
            }
            solutions={solutions}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
          />
        ))}
      </div>
    </div>
  );
});

const CellContentWrapper = React.memo(
  function CellContentWrapper({
    position,
    cell,
    pointerActionState,
    solutions,
    onPointerUp,
    onPointerMove,
    onPointerDown,
  }: {
    position: Position;
    cell: Cell;
    pointerActionState: string;
    solutions: Solution[];
    onPointerUp(e: React.PointerEvent, position: Position): void;
    onPointerMove(e: React.PointerEvent, position: Position): void;
    onPointerDown(e: React.PointerEvent, position: Position): void;
  }) {
    return (
      <div
        className={`cell state-${
          cell.state
        } pointer-${pointerActionState} solution-${
          solutions.find(([$position]) =>
            matchPositions($position, position)
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
    );
  },
  (prevProps, nextProps) =>
    customDiff(prevProps, nextProps, {
      position(prev, next) {
        return matchPositions(prev, next);
      },
      cell(prev, next) {
        return prev.state === next.state;
      },
    })
);
