/*
 * Advent of Code
 * Day 2 - 1st Solution
 */

import transformer from "../modules/transformer.ts";

type Play = "A" | "B" | "C" | "X" | "Y" | "Z";
type Handshape = 1 | 2 | 3;

const guide: Record<Play, Handshape> = {
  A: 1,
  X: 1, // rock
  B: 2,
  Y: 2, // paper
  C: 3,
  Z: 3, // scissors
};

/**
 * outcomes
 * 0 = loss
 * 3 = draw
 * 6 = win
 */
function outcome(a: Handshape, b: Handshape) {
  // default: tie
  let outcome: 0 | 3 | 6 = 3;
  // win
  // 1rock - 2paper = -1
  // 2paper - 3scissors = -1
  // 3scissors - 1rock = 2
  if (a - b === -1 || a - b === 2) {
    outcome = 6;
  }
  // lose
  // 1rock - 3paper = -2
  // 2paper - 1rock = 1
  // 3scissors - 2paper = 1
  if (a - b === -2 || a - b === 1) {
    outcome = 0;
  }
  return outcome;
}

transformer("./inputs/02.txt", async (readlines) => {
  let total_score = 0;
  for await (const line of readlines) {
    const game = line.split(" ") as unknown[] as Play[];
    const [opponent, player] = game.map((played) => guide[played]);

    total_score += outcome(opponent, player) + player;
  }
  return total_score.toString();
});
