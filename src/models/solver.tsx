import { Cell } from "./Cell";
import { BasicActions, Game } from "./Game";
import { Grid } from "./Grid";
import { matchPositions, Position } from "./Position";

type State = Game["grid"];
type Action = BasicActions;
export type Change = [Position, Action];
export type Solution = Change;

// Algorithm
//    - real_mines = mines - flags
//    - [Flag all] on real_mines = initials
//    - [Dig all]  on real_mines = 0
//
//    - [Dig self private & Flag sur private] on
//      self.real_mines - sur.real_mines = self.private.initials

const json = JSON.stringify;

const debug = process.env.DEBUG_SOLVER === "true";

function markSolution(
  solutions: Solution[],
  solution: Solution,
  description?: string
) {
  const [position, action] = solution;
  const duplicatedSolution = solutions.find(([$position]) =>
    matchPositions($position, position)
  );
  if (duplicatedSolution) {
    const [, $action] = duplicatedSolution;
    if (action !== $action) {
      console.warn(`Duplicated solution ${description} with different action.`);
    }
    return;
  }
  if (debug && description) console.log(description);
  solutions.push(solution);
}

export function solve(state: State): Solution[] {
  const solutions: Solution[] = [];

  // find new solutions around changes
  state.scan((position, cell) => {
    switch (cell.state) {
      case "revealed": {
        //    - [Flag all] on real_mines = initials
        //    - [Dig all]  on real_mines = 0
        const { remainMines, initials } = getGroupedAmounts(state, position);

        if (initials === 0) return; // no cells to take actions

        const handler: undefined | (($position: Position) => void) =
          remainMines === initials
            ? ($position) =>
                markSolution(
                  solutions,
                  [$position, "flag"],
                  `${json(position)} on DRAIN`
                )
            : remainMines === 0
            ? ($position) =>
                markSolution(
                  solutions,
                  [$position, "reveal"],
                  `${json(position)} on DRAIN`
                )
            : undefined;
        if (handler) {
          state
            .getSurroundings(position)
            .filter(([$position, $cell]) => $cell.state === "initial")
            .forEach(([$position, $cell]) => handler?.($position));

          return;
        }

        state
          .getSurroundings(position)
          .filter(
            ([surPosition, surCell]) =>
              surCell.state === "revealed" && surCell.mines !== 0
          )
          .forEach(([surPosition, surCell]) => {
            //  - [Dig self private & Flag sur private] on
            //    self.real_mines - sur.real_mines = self.private.initials
            const { remainMines: surRemainMines, initials: surInitials } =
              getGroupedAmounts(state, surPosition);

            const { selfPrivatePositions, surPrivatePositions } =
              getFragmentedPositions(state, position, surPosition);

            const selfPrivateInitials = selfPrivatePositions.filter(
              (position) => state.get(position).state === "initial"
            );

            if (remainMines - surRemainMines === selfPrivateInitials.length) {
              selfPrivateInitials.forEach((selfPosition) =>
                markSolution(
                  solutions,
                  [selfPosition, "flag"],
                  `${json(position)} & ${json(surPosition)}`
                )
              );
              const subPrivateInitials = surPrivatePositions.filter(
                (surPosition) => state.get(surPosition).state === "initial"
              );
              subPrivateInitials.forEach((surPosition) =>
                markSolution(
                  solutions,
                  [surPosition, "reveal"],
                  `${json(position)} & ${json(surPosition)}`
                )
              );
            }
          });
      }
    }
  });

  return solutions;
}

function getFragmentedPositions(
  state: State,
  self: Position,
  sibling: Position
) {
  const allPositions: Position[] = [];

  const [selfPositions, surPositions] = [self, sibling].map((p) =>
    state.getSurroundings(p).map(([$p]) => $p)
  );
  [selfPositions, surPositions].forEach((positions) =>
    // Cannot refactor with `filter` here!
    positions.forEach((position) => {
      if (
        !matchPositions(position, self) &&
        !matchPositions(position, sibling) &&
        !allPositions.some(($position) => matchPositions($position, position))
      )
        allPositions.push(position);
    })
  );

  const selfPrivatePositions: Position[] = [],
    surPrivatePositions: Position[] = [],
    commonPositions: Position[] = [];
  allPositions.forEach((position) => {
    const [isInSur, isInSelf] = [surPositions, selfPositions].map((positions) =>
      positions.some(($position) => matchPositions(position, $position))
    );
    // won't fail on both
    if (!isInSur) selfPrivatePositions.push(position);
    else if (!isInSelf) surPrivatePositions.push(position);
    else commonPositions.push(position);
  });

  return {
    allPositions,
    selfPrivatePositions,
    surPrivatePositions,
    commonPositions,
  };
}

function getGroupedAmounts(state: Grid<Cell>, position: Position) {
  const cell = state.get(position);
  const remainMines =
    cell.mines -
    state
      .getSurroundings(position)
      .filter(([$position, $cell]) => $cell.state === "flagged").length;
  const initials = state
    .getSurroundings(position)
    .filter(([$position, $cell]) => $cell.state === "initial").length;
  return { remainMines, initials };
}
