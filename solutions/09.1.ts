/*
 * Advent of Code
 * Day 9 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

type Direction = "up" | "right" | "down" | "left";

type Position = [x: number, y: number];

interface Knot {
  pos: Position;
}

interface KnotWithHistory extends Knot {
  history: {
    [key: number]: Set<number>;
  };
}

class Rope {
  #head: Knot;
  #tail: KnotWithHistory;

  constructor(startPosition: Position = [0, 0]) {
    this.#head = { pos: [...startPosition] };
    this.#tail = {
      pos: [...startPosition],
      history: [],
    };
    this.#record(this.#tail.pos);
  }

  move(direction: Direction) {
    switch (direction) {
      case "up":
        this.#head.pos[1] += 1;
        break;
      case "right":
        this.#head.pos[0] += 1;
        break;
      case "down":
        this.#head.pos[1] -= 1;
        break;
      case "left":
        this.#head.pos[0] -= 1;
        break;
    }
    this.#follow();
  }

  #follow() {
    const [diffX, diffY] = this.#head.pos.map((v, i) =>
      Math.abs(v - this.#tail.pos[i])
    );
    // not touching
    if (diffX > 1 || diffY > 1) {
      const [translateX, translateY] = this.#head.pos.map((v, i) =>
        Math.sign(v - this.#tail.pos[i])
      );
      this.#tail.pos[0] += translateX;
      this.#tail.pos[1] += translateY;
      this.#record(this.#tail.pos);
    }
  }

  #record([lastX, lastY]: Position) {
    if (!this.#tail.history[lastY]) {
      this.#tail.history[lastY] = new Set();
    }
    this.#tail.history[lastY].add(lastX);
  }

  history() {
    let count = 0;
    for (const [_, row] of Object.entries(this.#tail.history)) {
      count += row.size;
    }
    return count;
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
    }
  }
  return rope.history().toString();
});
