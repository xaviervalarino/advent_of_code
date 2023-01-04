/*
 * Advent of Code
 * Day 8 - 2nd Solution
 * * * * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

function directionalViz(treeline: number[], i: number) {
  const tree = treeline[i];
  const calcDirection = (segment: number[]) => {
    let count = 0;
    for (const next of segment) {
      count++;
      if (tree <= next) break;
    }
    return count;
  };
  return [
    calcDirection(treeline.slice(0, i).reverse()),
    calcDirection(treeline.slice(i + 1, treeline.length)),
  ];
}

function scenicScore(
  horizTreeline: number[],
  vertTreeline: number[],
  col: number,
  row: number
) {
  const [right, left] = directionalViz(horizTreeline, col);
  const [top, bottom] = directionalViz(vertTreeline, row);
  return top * right * bottom * left;
}

transformer("./inputs/08.txt", async (grid) => {
  const horizontalMap: number[][] = [];
  const verticalMap: number[][] = [];

  for await (const treeline of grid) {
    horizontalMap.push([...treeline].map((height) => +height));
    [...treeline].forEach((height, i) => {
      if (!verticalMap[i]) verticalMap[i] = [];
      verticalMap[i].push(+height);
    });
  }
  const highestScenicScore = horizontalMap.reduce(
    (prevTreeline, treeline, row, { length }) => {
      const currentTreeline = treeline.reduce((prevTree, _, col) => {
        const perimeter =
          row === 0 ||
          col === 0 ||
          row === length - 1 ||
          col === treeline.length - 1;
        if (perimeter) {
          return prevTree;
        }
        const currentTree = scenicScore(treeline, verticalMap[col], col, row);
        return prevTree > currentTree ? prevTree : currentTree;
      });
      return prevTreeline > currentTreeline ? prevTreeline : currentTreeline;
    },
    0
  );
  return highestScenicScore.toString();
});
