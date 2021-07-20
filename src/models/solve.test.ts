import { Cell } from "./Cell";
import { Grid } from "./Grid";
import { solve } from "./solver";

const flagged = "!";
const f = flagged;

const unrevealed = "";
const _ = unrevealed;

const digged = ".";
const d = digged;

type MineCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type GridCellMark = MineCount | typeof f | typeof _ | typeof d;

type GridMark = GridCellMark[][];

function generateGridMark(grid: Grid<Cell>): GridMark {
  const { width, height } = grid;
  const gridMark: GridMark = [];
  for (let y = 0; y < height; y++) {
    const row: GridMark[number] = [];
    for (let x = 0; x < width; x++) {
      const cell = grid.get([x, y]);
      row.push(
        cell.state === "flagged"
          ? flagged
          : cell.state === "revealed"
          ? (cell.siblingsCount as MineCount)
          : unrevealed
      );
    }
    gridMark.push(row);
  }
  return gridMark;
}

function parseGridMark(gridMark: GridMark): Grid<Cell> {
  const width = gridMark[0].length;
  const height = gridMark.length;
  const slots: Cell[] = [];
  gridMark.forEach((row) => {
    row.forEach((cell) => {
      slots.push(parseGridCellMark(cell));
    });
  });
  return new Grid(width, height, slots);
}

function parseGridCellMark(cell: GridCellMark): Cell {
  return new Cell(
    false,
    typeof cell === "number" ? cell : -1,
    cell === flagged
      ? "flagged"
      : cell === digged
      ? "revealed"
      : cell === unrevealed
      ? "initial"
      : typeof cell === "number"
      ? "revealed"
      : undefined
  );
}

const cases: {
  before: GridMark;
  after: GridMark;
}[] = [
  {
    before: [
      [1, 1],
      [1, _],
    ],
    after: [
      [1, 1],
      [1, f],
    ],
  },
  {
    before: [
      [1, _],
      [1, _],
      [2, _],
    ],
    after: [
      [1, _],
      [1, _],
      [2, d],
    ],
  },
  {
    before: [
      [1, _],
      [1, _],
      [2, _],
      [3, _],
    ],
    after: [
      [1, d],
      [1, f],
      [2, d],
      [3, f],
    ],
  },
  {
    before: [
      [1, _],
      [1, _],
      [_, _],
    ],
    after: [
      [1, _],
      [1, _],
      [d, d],
    ],
  },
  {
    before: [
      [_, f, 2, 0],
      [_, 3, 2, 1],
      [_, 2, 2, f],
      [_, _, _, 3],
    ],

    after: [
      [f, f, 2, 0],
      [_, 3, 2, 1],
      [_, 2, 2, f],
      [_, _, _, 3],
    ],
  },
];

cases.forEach((theCase, i) => {
  test(`case ${i}`, () => {
    // const theCase = cases[0];
    const grid = parseGridMark(theCase.before);
    console.log(generateGridMark(grid));

    let solutions = solve(grid, null, []);
    do {
      applySolutions();
      solutions = solve(grid, null, []);
    } while (solutions.length);

    function applySolutions() {
      solutions.forEach(([position, action]) => {
        const cell = grid.get(position);
        switch (action) {
          case "flag":
            return grid.set(
              position,
              new Cell(cell.isMine, cell.siblingsCount, "flagged")
            );
          case "reveal":
            return grid.set(
              position,
              new Cell(cell.isMine, cell.siblingsCount, "revealed")
            );
        }
      });
    }

    const gridMark = generateGridMark(grid);
    console.log(gridMark);
    expect(gridMark).toEqual(theCase.after);
  });
});
