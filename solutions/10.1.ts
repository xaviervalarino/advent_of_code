/*
 * Advent of Code
 * Day 10 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

function parse(instruction: string): [string, number?][] {
  const [cmd, v] = <["addx" | "noop", string]>instruction.split(" ");
  return cmd === "addx" && v
    ? [[instruction], [instruction, Number(v)]]
    : [[instruction]];
}

function sumSignalSrength(
  instructions: [string, number?][],
  interval: (cycle: number) => boolean
) {
  let X = 1;
  let cycle = 1;
  let signalStengths = 0;
  for (const [_, op] of instructions) {
    if (interval(cycle)) {
      signalStengths += X * cycle;
    }
    cycle++;
    if (op) X += op;
  }
  return signalStengths;
}

transformer("./inputs/10.txt", async (program) => {
  let instructions: [string, number?][] = [];
  for await (const instruction of program) {
    instructions = instructions.concat(parse(instruction));
  }
  const interval = (cycle: number) => cycle % 40 === 20 && cycle <= 220;
  return sumSignalSrength(instructions, interval).toString();
});
