import { Cell } from "./Cell";
import { BasicActions, Game } from "./Game";
import { matchPositions, Position } from "./Position";

type State = Game["grid"];
type Action = BasicActions;
export type Change = [Position, Action];
export type Solution = Change;

export function solve(
  state: State,
  previousState: State | null,
  previousSolutions: Solution[]
): Solution[] {
  return quickSolve(state);
}

function quickSolve(state: State): Solution[] {
  const solutions: Solution[] = [];
  // find new solutions around changes
  state.scan((position, cell) => {
    if (cell.state === "initial") {
      const action = getCellAction(state, position, cell);
      if (action) solutions.push([position, action]);
    }
  });

  return solutions;
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
}

function getChangeAction(state: Cell["state"]) {
  switch (state) {
    case "flagged":
      return "flag";
    case "revealed":
      return "reveal";
  }
}

function getCellAction(
  state: State,
  position: Position,
  cell: Cell
): Action | null {
  if (cell.state === "initial") {
    if (shouldDigCell(state, position, cell)) return "reveal";
    if (shouldFlagCell(state, position, cell)) return "flag";
  }
  return null;
}

function getUnrevealedAmount(state: State, position: Position, cell: Cell) {
  return (
    cell.state === "revealed" &&
    state
      .getSurroundings(position)
      .filter(
        ([_, $cell]) => $cell.state === "initial" || $cell.state === "flagged"
      ).length
  );
}

function shouldFlagCell(state: State, position: Position, cell: Cell): boolean {
  if (cell.state !== "initial") return false;
  // 1. Any surrounding cell satisfies that the amount of remaining cells matches the amount of not flagged mines
  if (
    state
      .getSurroundings(position)
      .some(
        ([position, $cell]) =>
          getUnrevealedAmount(state, position, $cell) ===
          $cell.surroundingsCount
      )
  ) {
    return true;
  }
  // 2. If it is not mine, the remaining cells would fail other surrounding cells
  if (scanChained(state, position, isFlagOverflow)) return true;

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
        .getSurroundings(position)
        .filter(([_, $cell]) => $cell.state === "flagged").length ===
      cell.surroundingsCount
    );
  }
  return false;
}

function shouldDigCell(state: State, position: Position, cell: Cell): boolean {
  if (cell.state !== "initial") return false;
  // 1. Any surrounding cell satisfies that the amount of flagged cells matches the amount of mines
  if (
    state
      .getSurroundings(position)
      .some(([position, $cell]) => cellHasEnoughFlags(state, position, $cell))
  ) {
    return true;
  }
  // 2. If is mine, the remaining cells would fail other surrounding cells
  if (scanChained(state, position, isMineInShort)) return true;

  // 3. ...
  return false;
}

// B{remain} >= maxCommonMines + privateB{initial}
function isFlagOverflow(
  [A, aFlags, aInitials]: number[],
  [B, bFlags, bInitials]: number[],
  [abCommonFlags, abCommonInitials]: number[]
) {
  return (
    B - bFlags >=
    Math.min(A - aFlags, B - bFlags, abCommonInitials) +
      (bInitials - abCommonInitials)
  );
}

// req(AB) >= AB{initial}
// req(AB) = (
//    > A - aFlags - privateA{initial}
//    > B - bFlags - privateB{initial}
// )
// AB{initial} = B - bFlags
function isMineInShort(
  [A, aFlags, aInitials]: number[],
  [B, bFlags, bInitials]: number[],
  [abCommonFlags, abCommonInitials]: number[]
) {
  return (
    Math.max(
      A - aFlags - (aInitials - abCommonInitials),
      B - bFlags - (bInitials - abCommonInitials)
    ) >=
    B - bFlags
  );
}

function scanChained(
  state: State,
  position: Position,
  callback: (
    [A, aFlags, aInitials]: number[],
    [B, bFlags, bInitials]: number[],
    [abCommonFlags, abCommonInitials]: number[]
  ) => boolean
): boolean {
  return state
    .getSurroundings(position)
    .filter(([bPosition, bCell]) => bCell.state === "revealed")
    .some(([bPosition, bCell]) => {
      const B = bCell.surroundingsCount;
      const surroundingsOfB = state.getSurroundings(bPosition);
      return surroundingsOfB
        .filter(([aPosition, aCell]) => aCell.state === "revealed")
        .filter(
          ([aPosition, aCell]) => !matchPositions(aPosition, position) // ignore current cell
        )
        .some(([aPosition, aCell]) => {
          const A = aCell.surroundingsCount;

          const surroundingsOfA = state.getSurroundings(aPosition);
          // ignore cells that cover A
          if (
            surroundingsOfA.some(([aaPosition]) =>
              matchPositions(aaPosition, position)
            )
          )
            return false;

          const filterState = (state: Cell["state"], x: [Position, Cell][]) =>
            x.filter(([position, cell]) => cell.state === state);

          const aFlags = filterState("flagged", surroundingsOfA).length;
          const bFlags = filterState("flagged", surroundingsOfB).length;
          const aInitials = filterState("initial", surroundingsOfA).length;
          const bInitials = filterState("initial", surroundingsOfB).length;

          const commonOfAB = surroundingsOfA.filter(([aaPosition, aaCell]) =>
            surroundingsOfB.some(([bPosition]) =>
              matchPositions(bPosition, aaPosition)
            )
          );
          const abCommonFlags = filterState("flagged", commonOfAB).length;
          const abCommonInitials = filterState("initial", commonOfAB).length;

          if (
            callback(
              [A, aFlags, aInitials],
              [B, bFlags, bInitials],
              [abCommonFlags, abCommonInitials]
            )
          ) {
            return true;
          }
        });
    });
}
