import { Cell } from "./Cell";
import { BasicActions, Game } from "./Game";
import { Position } from "./Grid";

type State = Game["grid"];
type Action = BasicActions;
export type Change = [Position, Action];
export type Solution = Change;

export function solve(
  state: State,
  previousState: State | null,
  previousSolutions: Change[]
): Change[] {
  return quickSolve(state, compare(state, previousState), previousSolutions);
}

export function matchPositions(a: Position, b: Position) {
  const [aX, aY] = a;
  const [bX, bY] = b;
  return aX === bX && aY === bY;
}

function quickSolve(
  state: State,
  changes: Change[],
  previousSolutions: Change[]
): Change[] {
  // previous solutions - changes + solutions from other changes
  const solutions: Change[] = [];
  // find solutions that have not been taken
  previousSolutions.forEach((solution) => {
    const change = changes.find((change) =>
      matchPositions(solution[0], change[0])
    );
    if (!change) solutions.push(solution);
  });

  const wentPositions: Position[] = [];
  // find new solutions around changes
  changes.forEach(([position]) => {
    state.getSiblings(position, 2).forEach(([[x, y], cell]) => {
      if (cell.state === "initial") {
        if (wentPositions.some((position) => matchPositions(position, [x, y])))
          return;

        wentPositions.push([x, y]);
        const action = getCellAction(state, x, y, cell);
        if (action) solutions.push([[x, y], action]);
      }
    });
  });

  return solutions.filter(
    ([position], i, solutions) =>
      !solutions
        .slice(0, i)
        .some(([$position]) => matchPositions(position, $position))
  );
}

function compare(state: State, previousState: State | null) {
  const changes: Change[] = [];
  state.scan((position, cell) => {
    let go = false;
    if (previousState === null) {
      go = true;
    } else {
      const previousCell = previousState.get(position);
      go =
        previousCell.state !== cell.state && previousCell.state === "initial";
    }
    if (go) {
      const action = getChangeAction(cell.state);
      if (action) changes.push([position, action]);
    }
  });
  return changes;

  function getChangeAction(state: Cell["state"]) {
    switch (state) {
      case "flagged":
        return "flag";
      case "revealed":
        return "reveal";
    }
  }
}

function getCellAction(
  state: State,
  x: number,
  y: number,
  cell: Cell
): Action | null {
  if (shouldDigCell(state, x, y, cell)) return "reveal";
  if (shouldFlagCell(state, x, y, cell)) return "flag";
  return null;
}

function getPotentialMinesAmount(state: State, position: Position, cell: Cell) {
  return (
    cell.state === "revealed" &&
    state
      .getSiblings(position)
      .filter(
        ([_, $cell]) => $cell.state === "initial" || $cell.state === "flagged"
      ).length
  );
}

function shouldFlagCell(
  state: State,
  x: number,
  y: number,
  cell: Cell
): boolean {
  if (cell.state !== "initial") return false;
  // 1. Any sibling cell satisfies that the amount of remaining cells matches the amount of not flagged mines
  if (
    state
      .getSiblings([x, y])
      .some(
        ([position, $cell]) =>
          getPotentialMinesAmount(state, position, $cell) ===
          $cell.siblingsCount
      )
  ) {
    return true;
  }
  // 2. If it is not mine, the remaining cells would fail other surrounding cells
  // 3. ...
  return false;
}

function cellHasEnoughFlags(
  state: State,
  position: Position,
  cell: Cell
): boolean {
  if (cell.state === "revealed") {
    return (
      state
        .getSiblings(position)
        .filter(([_, $cell]) => $cell.state === "flagged").length ===
      cell.siblingsCount
    );
  }
  return false;
}

function shouldDigCell(
  state: State,
  x: number,
  y: number,
  cell: Cell
): boolean {
  if (cell.state !== "initial") return false;
  // 1. Any sibling cell satisfies that the amount of flagged cells matches the amount of mines
  if (
    state
      .getSiblings([x, y])
      .some(([position, $cell]) => cellHasEnoughFlags(state, position, $cell))
  ) {
    return true;
  }
  // 2. If is mine, the remaining cells would fail other surrounding cells

  // 3. ...
  return false;
}
