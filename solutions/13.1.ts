/*
 * Advent of Code
 * Day 13 - 1st Solution
 * * * * * * * * * * * * * * *
 * w|!export NO_COLOR=1; deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

type Packet = (number | Packet)[];

function compare([left, right]: Packet[]): boolean | undefined {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const l = left[i];
    const r = right[i];

    // if left runs out, then true; if right runs out, then false
    if (!l) return true;
    if (!r) return false;

    // if both are integers, the lower integer should come first
    if (Number.isInteger(l) && Number.isInteger(r)) {
      if (l < r) return true;
      if (l > r) return false;
    }

    // if both are lists, loop through values and run comparison
    if (Array.isArray(l) && Array.isArray(r)) {
      const subtest = compare([l, r]);
      if (subtest !== undefined) return subtest;
    }

    // if one is a list, convert the other to a list and compare
    if (Array.isArray(l) && Number.isInteger(r)) {
      const subtest = compare([l, [r]]);
      if (subtest !== undefined) return subtest;
    }
    if (Number.isInteger(l) && Array.isArray(r)) {
      const subtest = compare([[l], r]);
      if (subtest !== undefined) return subtest;
    }
  }
}

transformer("./inputs/13.txt", async (readlines) => {
  const packetsInOrder: number[] = [];
  let pair: Packet[] = [];
  let index = 1;
  for await (const line of readlines) {
    if (line.length) pair.push(JSON.parse(line));
    if (pair.length === 2) {
      if (compare(pair)) packetsInOrder.push(index);
      pair = [];
      index++;
    }
  }
  return packetsInOrder.reduce((sum, index) => sum + index).toString();
});
