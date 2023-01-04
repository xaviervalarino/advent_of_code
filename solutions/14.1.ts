/*
 * Advent of Code
 * Day 14 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";
import graphToPng from "../modules/graph-to-png.ts";

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

function simulate(rocks: Set<string>, sand: Set<string>, limit: number) {
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
      if (!rocks.has(point) && !sand.has(point)) {
        return move;
      }
    }
  };

  while (moveable) {
    const move = moveSpace(last);
    if (move) {
      if (move.y >= limit) return;
      last = move;
    } else {
      moveable = false;
    }
  }
  return last;
}

function _draw(rocks: Set<string>, sand: Set<string>) {
  const createMarks = (symbol: string, structures: Set<string>) => {
    return Array.from(structures, (coor) => {
      const [x, y] = coor.split(",").map((axis) => +axis);
      return { x, y, symbol };
    });
  };
  const chartmarks = [...createMarks("▓", rocks), ...createMarks("o", sand)];
  graphToPng(chartmarks, "./img-outputs/14.1.png");
}

transformer("./inputs/14.txt", async (readlines) => {
  const { rocks, bottom } = await caveScanner(readlines);
  const sand = new Set<string>();

  let fallingIntoTheAbyss = false;

  while (!fallingIntoTheAbyss) {
    const restingPlace = simulate(rocks, sand, bottom);
    if (restingPlace) {
      sand.add(coorStr(restingPlace));
    } else {
      fallingIntoTheAbyss = true;
    }
  }

  // Visualization
  // w|!./run --viz %
  if (Deno.args.includes("--viz")) _draw(rocks, sand);

  return sand.size.toString();
});
