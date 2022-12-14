/*
 * Advent of Code
  * Day 1 - 1st Solution
 */

import transformer from "../modules/transformer.ts";

const totalCaloriesPerElf: number[] = [];

transformer("./inputs/01.txt", async (readlines) => {
  let index = 0;
  for await (const line of readlines) {
    if (line.length) {
      const prev = totalCaloriesPerElf[index] || 0;
      const current = +line;
      totalCaloriesPerElf[index] = prev + current;
    } else {
      index++;
    }
  }
  const maxCalories = totalCaloriesPerElf.sort((a, b) => a - b)[
    totalCaloriesPerElf.length - 1
  ];
  return maxCalories.toString()
});
