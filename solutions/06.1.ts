/*
 * Advent of Code
 * Day 6 - 1st Solution
 * * * * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

transformer("./inputs/06.txt", async (readlines) => {
  let startOfMarker = "";
  for await (const datastream of readlines) {
    for (let i = 0; i < datastream.length; i++) {
      const marker = datastream.substring(i, i + 4);
      const test = [...marker].every((char, _, arr) => {
        const indices = arr.flatMap((l, i) => (char === l ? i : []));
        return indices.length === 1;
      });
      if (test) {
        startOfMarker = (i + 4).toString();
        break;
      }
    }
  }
  return startOfMarker;
});
