/*
 * Advent of Code
 * Day 11 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

type Operation = (input: number) => number;
type Test = (input: number) => number;

interface MonkeyFns {
  operation: Operation;
  test: Test;
}

function buildOperation([arg1, sign, arg2]: [string, "+" | "-" | "*", string]) {
  let old: number;
  const assign = (v: string) => () => isNaN(Number(v)) ? old : Number(v);
  const assignArg1 = assign(arg1);
  const assignArg2 = assign(arg2);
  return {
    "+": (input: number) => {
      old = input;
      return Math.floor((assignArg1() + assignArg2()) / 3);
    },
    "-": (input: number) => {
      old = input;
      return Math.floor((assignArg1() - assignArg2()) / 3);
    },
    "*": (input: number) => {
      old = input;
      return Math.floor((assignArg1() * assignArg2()) / 3);
    },
  }[sign];
}

function buildTest(divisibleBy: number, ifTrue: number, ifFalse: number) {
  return (v: number) => (v % divisibleBy === 0 ? ifTrue : ifFalse);
}

function monkeyFactory(notesOnMonkey: string[]): [number[], MonkeyFns] {
  const notes = notesOnMonkey.reduce((accumulator, note) => {
    const [_attr, data] = note.split(":");
    if (data) accumulator.push(data.trim());
    return accumulator;
  }, <string[]>[]);
  const monkeyStartingItems = notes[0].split(", ").map((v) => Number(v));
  const monkeyFns = {
    operation: buildOperation(
      <[string, "+" | "-" | "*", string]>(
        notes[1].replace("new = ", "").split(" ")
      )
    ),
    test: buildTest(
      +notes[2].replace("divisible by ", ""),
      +notes[3].replace("throw to monkey ", ""),
      +notes[4].replace("throw to monkey ", "")
    ),
  };
  return [monkeyStartingItems, monkeyFns];
}

async function parse(
  notes: AsyncIterable<string>
): Promise<[number[][], MonkeyFns[]]> {
  const allStartingItems: number[][] = [];
  const allMonkeyFns: MonkeyFns[] = [];
  let notesOnMonkey: string[] = [];
  for await (const note of notes) {
    if (note.length) {
      notesOnMonkey.push(note);
    }
    if (notesOnMonkey.length === 6) {
      const [startingItems, monkeyFns] = monkeyFactory(notesOnMonkey);
      allStartingItems.push(startingItems);
      allMonkeyFns.push(monkeyFns);
      notesOnMonkey = [];
    }
  }
  return [allStartingItems, allMonkeyFns];
}

// each turn needs to update the list of items held by a monkey
transformer("./inputs/11.txt", async (notes) => {
  const [initialItems, allMonkeyFns] = await parse(notes);

  function calculateRound(
    items: number[][],
    inspected: number[] = [],
    i = 0
  ): [number[], number[][]] {
    const outcome = [...items];
    for (const item of outcome[i]) {
      const fns = allMonkeyFns[i];
      const updatedItem = fns.operation(item);
      const tossToMonkey = fns.test(updatedItem);
      outcome[tossToMonkey].push(updatedItem);
    }

    if (!inspected[i]) inspected[i] = 0;
    inspected[i] += outcome[i].length;
    // clear tossed items for this monkey
    outcome[i] = [];
    i++;

    if (i === outcome.length) return [inspected, outcome];
    return calculateRound(outcome, inspected, i);
  }

  function rounds(
    count: number,
    items: number[][],
    inspections: number[] = []
  ): number[] {
    const [inspected, outcome] = calculateRound(items);
    inspections = inspected.map((v, i) => v + (inspections[i] || 0));
    count--;
    if (!count) return inspections;
    return rounds(count, outcome, inspections);
  }

  // two most active monkeys
  const [monkey1, monkey2] = rounds(20, initialItems).sort((a, b) => b - a);

  // level of monkey business
  return (monkey1 * monkey2).toString();
});
