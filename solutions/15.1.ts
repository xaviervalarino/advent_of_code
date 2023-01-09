/*
 * Advent of Code
 * Day 15 - 1st Solution
 * * * * * * * * * * * *
 * w|!./run %
 */

import transformer from "../modules/transformer.ts";
import graphToPng from "../modules/graph-to-png.ts";

const INPUT = "Sensor at x=8, y=7: closest beacon is at x=2, y=10";

const [sensor, beacon] = INPUT.split(":").map((txt) => {
  return {
    x: +txt.match(/x=([-]*\d+)/)![1],
    y: +txt.match(/y=([-]*\d+)/)![1],
  };
});

const edges = [{ ...beacon }];
let unfilled = true;

// Going clockwise around the perimeter of the sensor
while (unfilled) {
  const { x, y } = edges[edges.length - 1];
  const edge = { x, y };
  // North to East
  if (x >= sensor.x && y < sensor.y) {
    edge.x++;
    edge.y++;
  }
  // East to South
  if (x > sensor.x && y >= sensor.y) {
    edge.x--;
    edge.y++;
  }
  // South to West
  if (x <= sensor.x && y > sensor.y) {
    edge.x--;
    edge.y--;
  }
  // West to North
  if (x < sensor.x && y <= sensor.y) {
    edge.x++;
    edge.y--;
  }
  if (edge.x === beacon.x && edge.y === beacon.y) {
    unfilled = false;
  } else {
    edges.push(edge);
  }
}

// draw out the perimeter
const marks = edges.slice(1).map((v) => ({ ...v, symbol: "*" }));
marks.push({ ...beacon, symbol: "B" });
marks.push({ ...sensor, symbol: "S" });
graphToPng(marks, "./img-outputs/15.1.png");

/* transformer("./inputs/test.txt", async (readlines) => {
  for await (const line of readlines) {
    console.log(line)
  }
  return "";
}); */
