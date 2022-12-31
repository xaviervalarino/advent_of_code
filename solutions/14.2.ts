/*
 * Advent of Code
 * Day 14 - 2nd Solution
 * * * * * * * * * * * * * * *
 * w|!export NO_COLOR=1; deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

type Coordinates = { x: number; y: number };

const STARTING_POS = { x: 500, y: 0 };

// Change coordinates into a string to store in a Set
function coorStr(coordinates: Coordinates) {
  return coordinates.x + "," + coordinates.y;
}

async function caveScanner(readlines: AsyncIterableIterator<string>) {
  const rocks = new Set<string>();
  let bottom = 0;
  for await (const line of readlines) {
    const paths = line.split(" -> ").map((coor) => {
      const [x, y] = coor.split(",").map((axis) => +axis);
      return { x, y };
    });
    // start one ahead, since these are being computed as pairs
    for (let i = 1; i < paths.length; i++) {
      const [p1, p2] = [paths[i - 1], paths[i]].sort(
        (a, b) => a.x - b.x || a.y - b.y
      );
      for (let x = p1.x; x <= p2.x; x++) {
        const point = coorStr({ ...p1, x: x });
        if (bottom < p1.y) bottom = p1.y;
        rocks.add(point);
      }
      for (let y = p1.y; y <= p2.y; y++) {
        const point = coorStr({ ...p1, y: y });
        if (bottom < y) bottom = y;
        rocks.add(point);
      }
    }
  }
  return { rocks, bottom };
}

function simulate(rocks: Set<string>, sand: Set<string>, floor: number) {
  let last = STARTING_POS;
  let moveable = true;

  const moveSpace = ({ ...last }: Coordinates) => {
    const moves = [
      { x: last.x, y: last.y + 1 }, //     down
      { x: last.x - 1, y: last.y + 1 }, // down-left
      { x: last.x + 1, y: last.y + 1 }, // down-right
    ];
    for (const move of moves) {
      const point = coorStr(move);
      if (!rocks.has(point) && !sand.has(point) && move.y !== floor) {
        return move;
      }
    }
  };

  while (moveable) {
    const move = moveSpace(last);
    if (move) last = move;
    else moveable = false;
  }
  return last;
}

function _draw(rockCoors: Set<string>, sandCoors: Set<string>, bottom: number) {
  const parseCoors = (structure: Set<string>) => {
    return Array.from(structure, (coor) => {
      return coor.split(",").map((axis) => +axis);
    });
  };
  const rocks = parseCoors(rockCoors).sort();
  const sands = parseCoors(sandCoors).sort();

  // get the edges of the grid and add two cells of buffer
  const left = sands[0][0] - 2;
  const right = sands[sands.length - 1][0] + 2;

  const grid = Array.from(new Array(bottom + 1), () =>
    Array.from(new Array(right - left), () => " ")
  );

  for (const rock of rocks) {
    let [x, y] = rock;
    x = x - left;
    grid[y][x] = "▓";
  }
  for (const sand of sands) {
    let [x, y] = sand;
    x = x - left;
    grid[y][x] = "o";
  }
  return grid.map((line) => line.join("")).join("\n");
}

transformer("./inputs/14.txt", async (readlines) => {
  let result = "";
  const { rocks, bottom } = await caveScanner(readlines);
  const floor = bottom + 2;
  const sand = new Set<string>();
  const source = coorStr(STARTING_POS);
  let restingPlace = "";

  while (restingPlace !== source) {
    restingPlace = coorStr(simulate(rocks, sand, floor));
    sand.add(restingPlace);
  }

  // Visualization
  // w|!export NO_COLOR=1; deno run --allow-read % --viz > outputs/14.2.txt
  if (Deno.args.includes("--viz")) {
    result += _draw(rocks, sand, floor);
  }

  result += "\n" + sand.size;
  return result;
});
