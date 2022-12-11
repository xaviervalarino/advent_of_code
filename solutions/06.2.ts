/*
 * Advent of Code
 * Day 6 - 2nd Solution
 * * * * * * * * * * * * * * *
 * w|!deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

transformer("./inputs/06.txt", async (readlines) => {
  let startOfMarker = "";
  for await (const datastream of readlines) {
    for (let i = 0; i < datastream.length; i++) {
      const marker = datastream.substring(i, i + 14);
      const test = [...marker].every((char, _, arr) => {
        const indices = arr.flatMap((l, i) => (char === l ? i : []));
        return indices.length === 1;
      });
      if (test) {
        startOfMarker = (i + 14).toString();
        break;
      }
    }
  }
  return startOfMarker;
});
