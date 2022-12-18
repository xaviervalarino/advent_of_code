/*
 * Advent of Code
 * Day 9 - 1st Solution
 * * * * * * * * * * * * * * *
 * w|!deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

type Direction = "up" | "right" | "down" | "left";

type Position = [x: number, y: number];

interface Knot {
  pos: Position;
  next(): Knot | Tail;
}
interface Tail {
  pos: Position;
  history: {
    [key: number]: Set<number>;
  };
}

class Rope {
  #knots: [...Knot[], Tail];
  #head: Knot;
  #tail: Tail;

  #createKnots(length: number, startingPosition: Position) {
    const knots = [] as unknown as [...Knot[], Tail];
    for (let i = 0; i < length; i++) {
      if (i === length - 1) {
        knots.push(<Tail>{
          pos: [...startingPosition],
          history: [],
        });
        break
      }
      knots.push(<Knot>{
        pos: [...startingPosition],
        next: () => knots[i + 1],
      });
    }
    return knots;
  }

  constructor(length: number = 2, startPosition: Position = [0, 0]) {
    this.#knots = this.#createKnots(length, startPosition);
    this.#head = <Knot>this.#knots[0];
    this.#tail = <Tail>this.#knots[this.#knots.length - 1];
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
    this.#follow(this.#head);
  }

  #follow(knot: Knot) {
    const nextKnot = knot.next();
    const [diffX, diffY] = knot.pos.map((v, i) =>
      Math.abs(v - nextKnot.pos[i])
    );
    // not touching
    if (diffX > 1 || diffY > 1) {
      const [translateX, translateY] = knot.pos.map((v, i) =>
        Math.sign(v - nextKnot.pos[i])
      );
      nextKnot.pos[0] += translateX;
      nextKnot.pos[1] += translateY;
      if ('next' in nextKnot) {
        this.#follow(nextKnot);
      } else {
        this.#record(nextKnot.pos);
      }
    }
  }

  #record([lastX, lastY]: Position) {
    if (!this.#tail.history![lastY]) {
      this.#tail.history![lastY] = new Set();
    }
    this.#tail.history![lastY].add(lastX);
  }

  history() {
    let count = 0;
    for (const [_, row] of Object.entries(this.#tail.history!)) {
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
  const rope = new Rope(10);
  for await (const motion of seriesOfMotions) {
    const steps = unpack(motion);
    for (const step of steps) {
      rope.move(step);
    }
  }
  return rope.history().toString();
});
