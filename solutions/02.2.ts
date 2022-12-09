/*
 * Advent of Code
 * Day 2 - 2nd Solution
 */

import transformer from "../modules/transformer.ts";

type HandshapeCode = "A" | "B" | "C";
type Handshape = 1 | 2 | 3;
type OutcomeCode = "X" | "Y" | "Z";
type Outcome = 0 | 3 | 6;

const handshapeGuide: Record<HandshapeCode, Handshape> = {
  A: 1, // rock
  B: 2, // paper
  C: 3, // scissors
};

const outcomeGuide: Record<OutcomeCode, Outcome> = {
  X: 0, // lose
  Y: 3, // draw
  Z: 6, // win
};

function handshapeToPlay(a: Handshape, b: Outcome) {
  // default: tie, same as opponent
  let handshape = a;
  // win
  // 1rock < 2paper
  // 2paper < 3scissors
  // 3scissors < 1rock
  if (b === 6) {
    handshape = a === 1 ? 2 : a === 2 ? 3 : 1;
  }
  // lose
  // 1rock > 3scissors
  // 2paper > 1rock
  // 3scissors > 2paper
  if (b === 0) {
    handshape = a === 1 ? 3 : a === 2 ? 1 : 2;
  }
  return handshape;
}

transformer("./inputs/02.txt", async (readlines) => {
  let totalScore = 0;
  for await (const line of readlines) {
    const [opponentCode, outcomeCode] = line.split(" ") as unknown[] as [
      HandshapeCode,
      OutcomeCode
    ];
    const opponent = handshapeGuide[opponentCode];
    const outcome = outcomeGuide[outcomeCode];

    totalScore += handshapeToPlay(opponent, outcome) + outcome;
  }
  return totalScore.toString();
});
