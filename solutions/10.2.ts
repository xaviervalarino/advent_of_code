/*
 * Advent of Code
 * Day 10 - 2nd Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

type Instruction = [string, number?];
type Pixel = "." | "#";
type ScreenSize = [columns: number, rows: number];

function parse(instructTxt: string): Instruction[] {
  const [cmd, v] = <["addx" | "noop", string]>instructTxt.split(" ");
  return cmd === "addx" && v
    ? [[instructTxt], [instructTxt, Number(v)]]
    : [[instructTxt]];
}

function drawnOnCRT(instructions: Instruction[], [cols, rows]: ScreenSize) {
  const CRT: string[] = [];
  const pixels: Pixel[] = [];
  let X = 1;
  let cycle = 1;
  for (const [_, op] of instructions) {
    const sprite = [X - 1, X, X + 1]
    const position = (cycle - 1) % cols
    const pixel = sprite.includes(position) ? "#" : ".";
    pixels.push(pixel);
    cycle++;
    if (op) X += op;
  }
  while (CRT.length <= rows) {
    CRT.push(pixels.splice(0, 40).join(""));
  }
  return CRT.join("\n");
}

transformer("./inputs/10.txt", async (program) => {
  let instructions: Instruction[] = [];
  for await (const instruction of program) {
    instructions = instructions.concat(parse(instruction));
  }
  return drawnOnCRT(instructions, [40, 6]);
});
