/*
 * Advent of Code
 * Day 5 - 2nd Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

transformer("./inputs/05.txt", async (readlines) => {
  let diagramFeed = true;
  const stacks: string[][] = [];
  const moves: number[][] = [];
  for await (const line of readlines) {
    if (diagramFeed) {
      diagramFeed = line.length > 0;
      const stackDiagram = line.match(/.{1,4}/g) || [];
      stackDiagram.forEach((stack, i) => {
        const crate = stack.match(/\[([A-Z])\]/);
        if (crate) {
          stacks[i] = stacks[i] || [];
          stacks[i].push(crate[1]);
        }
      });
    } else {
      moves.push(
        line
          .split(/move|from|to/)
          .slice(1)
          .map((v) => +v.trim())
      );
    }
  }
  moves.map(([qty, from, to]) => {
    const fromStack = stacks[from - 1];
    const toStack = fromStack.slice(0, qty).concat(stacks[to - 1]);
    fromStack.splice(0, qty);
    stacks[to - 1] = toStack;
  });
  return stacks.reduce((onTop, stack) => (onTop += stack[0]), "");
});
