/*
 * Advent of Code
 * Day 9 - 1st Solution
 * * * * * * * * * * * * * * *
 * w|!deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

type Position = [column: number, row: number];
type Direction = "up" | "right" | "down" | "left";

interface Route {
  position: Position;
  visited: Set<number>[];
}

class Rope {
  #head: Position;
  #tail: Route;

  #logVisit([col, row]: Position) {
    if (!this.#tail.visited[col]) {
      this.#tail.visited[col] = new Set();
    }
    this.#tail.visited[col].add(row);
  }

  #updateTail() {
    const prev: Position = [...this.#tail.position];
    const [colDiff, rowDiff] = this.#head.map((v, i) => Math.abs(prev[i] - v));
    const move = this.#head.map((v, i) => Math.sign(v - prev[i]));

    if ((colDiff === 1 && rowDiff === 2) || (colDiff === 2 && rowDiff === 1)) {
      const prev: Position = [...this.#tail.position];
      this.#tail.position = <Position>prev.map((v, i) => v + move[i]);
    }
    if (colDiff === 2 && rowDiff === 0) {
      this.#tail.position[0] += move[0];
    }
    if (colDiff === 0 && rowDiff === 2) {
      this.#tail.position[1] += move[1];
    }
    this.#logVisit(prev);
  }

  constructor(startingPosition: Position = [0, 0]) {
    this.#head = startingPosition;
    this.#tail = {
      position: startingPosition,
      visited: [],
    };
  }

  move(direction: Direction) {
    const movement = {
      up: [1, 0],
      right: [0, 1],
      down: [-1, 0],
      left: [0, -1],
    }[direction];
    this.#head = <Position>this.#head.map((v, i) => v + movement[i]);
    this.#updateTail();
  }

  draw() {
    const visits = this.#tail.visited.map((row) => {
      const arr = [];
      for (const entry of row.values()) {
        arr.push(entry);
      }
      return arr.sort((a, b) => a - b);
    });
    const rightmostColumns = visits.map((row) => row[row.length - 1]);
    const length = Math.max.apply(null, rightmostColumns) + 1;
    const graph = visits.map((row) => {
      const arr = Array.from(new Array(length), () => ".");
      for (const colVisits of row) {
        arr[colVisits] = "#";
      }
      return arr;
    });
    return graph
      .map((row) => " " + row.join(""))
      .reverse()
      .join("\n");
  }

  visitedPositionsByTail() {
    return this.#tail.visited.reduce((count, row) => (count += row.size), 0);
  }
}

function unpack(motion: string) {
  const [direction, steps] = <[Direction, number]>motion.split(" ").map((p) => {
    if (p.match(/\d+/)) return +p;
    return { U: "up", R: "right", D: "down", L: "left" }[p];
  }, []);
  return Array.from(new Array(steps), () => direction);
}

transformer("./inputs/09.txt", async (seriesOfMotions) => {
  const rope = new Rope();
  for await (const motion of seriesOfMotions) {
    const steps = unpack(motion);
    for (const step of steps) {
      rope.move(step);
      // console.log(rope.draw() + '\n');
    }
  }
  return rope.visitedPositionsByTail().toString();
});
