/*
 * Advent of Code
 * Day 3 - 1st Solution
 */

import transformer from "../modules/transformer.ts";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const priority = alphabet.concat(alphabet.toUpperCase()).split("");
const getPriority = (item: string) => priority.indexOf(item) + 1;

transformer("./inputs/03.txt", async (rucksacks) => {
  let prioritySum = 0;
  for await (const rucksack of rucksacks) {
    const compartment1 = rucksack.substring(0, rucksack.length / 2).split("");
    const compartment2 = rucksack.substring(rucksack.length / 2).split("");
    const duplicateItems = compartment1.reduce<string[]>(
      (acc, item): string[] => {
        if (compartment2.indexOf(item) >= 0 && acc.indexOf(item) === -1) {
          acc.push(item);
        }
        return acc;
      },
      []
    );
    duplicateItems.forEach((item) => (prioritySum += getPriority(item)));
  }
  return prioritySum.toString()
});
