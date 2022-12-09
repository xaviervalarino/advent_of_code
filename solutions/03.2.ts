/*
 * Advent of Code
 * Day 3 - 2nd Solution
 */

import transformer from "../modules/transformer.ts";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const priority = alphabet.concat(alphabet.toUpperCase()).split("");
const getPriority = (item: string) => priority.indexOf(item) + 1;

transformer("./inputs/03.txt", async (rucksacks) => {
  const groups: string[][][] = [];
  let currentGroup: string[][] = [];
  for await (const rucksack of rucksacks) {
    currentGroup.push(rucksack.split(""));
    if (currentGroup.length === 3) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  }
  return groups
    .reduce((acc, group) => {
      const findDups =
        (elfIndex: number) =>
        (acc: string[], item: string): string[] => {
          if (group[elfIndex].indexOf(item) >= 0 && acc.indexOf(item) === -1) {
            acc.push(item);
          }
          return acc;
        };
      const duplicateItem = group[0]
        .reduce<string[]>(findDups(1), [])
        .reduce(findDups(2), [])[0];
      return acc + getPriority(duplicateItem);
    }, 0)
    .toString();
});
