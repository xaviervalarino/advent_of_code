/*
 * Advent of Code
 * Day 11 - 2nd Solution
 * * * * * * * * * * * * * * *
 * w|!export NO_COLOR=1; deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

type Operation = (input: number) => number;
type Test = (input: number) => number;

interface MonkeyFns {
  operation: Operation;
  test: Test;
}

function buildOperation([arg1, sign, arg2]: [
  string,
  "+" | "*",
  string
]): Operation {
  let old: number;
  const assign = (v: string) => (isNaN(Number(v)) ? old : Number(v));
  return (input: number) => {
    old = input;
    const assignedArg1 = assign(arg1);
    const assignedArg2 = assign(arg2);
    return {
      "+": assignedArg1 + assignedArg2,
      "*": assignedArg1 * assignedArg2,
    }[sign];
  };
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

  const monkeyTest = <[string, "+" | "*", string]>notes[1].replace("new = ", "").split(" ")
  const monkeyFns = {
    operation: buildOperation(monkeyTest),
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

class CalculateRounds {
  #items: number[][];
  #fns: MonkeyFns[];
  constructor(initialItems: number[][], allMonkeyFns: MonkeyFns[]) {
    this.#items = initialItems;
    this.#fns = allMonkeyFns;
  }

  #turn(itemsHeldByMonkey: number[], monkeyFns: MonkeyFns) {
    const { operation, test } = monkeyFns;
    const outcome = new Map<number, number[]>();
    for (const item of itemsHeldByMonkey) {
      const updatedItem = Math.floor(operation(item) / 3);
      const passTo = test(updatedItem);
      if (!outcome.has(passTo)) outcome.set(passTo, <number[]>[]);
      const itemsToPass = <number[]>outcome.get(passTo);
      itemsToPass.push(updatedItem);
    }
    return outcome;
  }

  #round(allItems: number[][]) {
    // each turn needs to update the items list before the next monkey's turn begins
    const updatedItems: number[][] = [...allItems];
    const monkeyBusiness: number[] = [];
    for (let monkeyID = 0; monkeyID < allItems.length; monkeyID++) {
      const outcome = this.#turn(updatedItems[monkeyID], this.#fns[monkeyID]);
      monkeyBusiness[monkeyID] = updatedItems[monkeyID].length;
      // clear out items that where passed during this turn
      updatedItems[monkeyID] = [];
      for (const [passTo, items] of outcome) {
        if (items.length) {
          const monkeyItems = updatedItems[passTo];
          updatedItems[passTo] = monkeyItems.concat(items);
        }
      }
    }
    return { updatedItems, monkeyBusiness };
  }

  calculate(rounds: number) {
    let updatedItems = [...this.#items];
    let monkeyBusiness: number[] = [];
    for (let i = 0; i < rounds; i++) {
      const outcome = this.#round(updatedItems);
      updatedItems = outcome.updatedItems;
      monkeyBusiness = outcome.monkeyBusiness.map((item, i) => {
        return (monkeyBusiness[i] || 0) + item;
      });
    }
    // most active to least active monkey
    return monkeyBusiness.sort((a, b) => b - a);
  }
}

transformer("./inputs/11.txt", async (notes) => {
  const rounds = new CalculateRounds(...(await parse(notes)));
  // two most active monkeys
  const [monkey1, monkey2] = rounds.calculate(20);
  // level of monkey business
  return (monkey1 * monkey2).toString();
});
