/*
 * Advent of Code
 * Day _ - _ Solution
 * * * * * * * * * * * * * * *
 * w|!deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

transformer("./inputs/test.txt", async (readlines) => {
  for await (const line of readlines) {
    console.log(line)
  }
    return '';
});
