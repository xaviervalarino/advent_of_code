/*
 * Advent of Code
 * Day 8 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";

function checkVisibility(i: number, treeline: number[]) {
  const height = treeline[i];
  const test = (nextHeight: number) => height > nextHeight;
  const visiblityBack = treeline.slice(0, i).every(test);
  const visiblityForward = treeline.slice(i + 1, treeline.length).every(test);
  return visiblityBack || visiblityForward;
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
  const visible = horizontalMap.reduce((count, treeline, row, { length }) => {
    for (let col = 0; col < treeline.length; col++) {
      const perimeter =
        row === 0 ||
        col === 0 ||
        row === length - 1 ||
        col === treeline.length - 1;
      if (perimeter) {
        count++;
      } else {
        if (
          checkVisibility(col, treeline) ||
          checkVisibility(row, verticalMap[col])
        ) {
          count++;
        }
      }
    }
    return count;
  }, 0);
  return visible.toString();
});
