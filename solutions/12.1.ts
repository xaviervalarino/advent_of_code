/*
 * Advent of Code
 * Day 12 - 1st Solution
 * * * * * * * * * * * * * * *
 * w|!export NO_COLOR=1; deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

// Topo height is keyed by its coordinates as a string -> "x,y"
type Topography = {
  [key: string]: number;
};

function testVertices(x: number, y: number) {
  const up = [x, y + 1];
  const down = [x, y - 1];
  const left = [x - 1, y];
  const right = [x + 1, y];
  return [up, right, down, left].map((coor) => coor.toString());
}

function createGraph(topography: Topography) {
  const graph = new Map<string, string[]>();
  for (const square in topography) {
    const elevation = topography[square];
    const [x, y] = square.split(",").map((v) => +v);
    // get edges that have an elevation that can be moved to
    const edges = testVertices(x, y).filter((key) => {
      const testElevation = topography[key];
      return testElevation <= elevation + 1;
    });
    graph.set(square, edges);
  }
  return graph;
}

async function parse(readlines: AsyncIterableIterator<string>) {
  let start!: string, end!: string;
  const topography: Topography = {};
  let y = 0;
  for await (const line of readlines) {
    let x = 0;
    for (const l of line.split("")) {
      const key = `${x},${y}`;
      let elevation: number;
      if (l === "S") {
        start = key;
        elevation = 0;
      } else if (l === "E") {
        end = key;
        elevation = 25;
      } else {
        elevation = l.charCodeAt(0) - 97;
      }
      topography[key] = elevation;
      x++;
    }
    y++;
  }
  const graph = createGraph(topography);
  return { start, end, graph };
}

function bfs(start: string, end: string, graph: Map<string, string[]>) {
  const queue: [string, string[]][] = [[start, []]];
  const visited = new Set<string>();

  while (queue.length) {
    const [currentNode, [...path]] = <[string, string[]]>queue.shift();
    // record this current node as part of the path used to get to destinations
    if (currentNode !== start) path.push(currentNode);

    if (currentNode === end) return path;
    if (!visited.has(currentNode) && graph.has(currentNode)) {
      const destinations = graph
        .get(currentNode)!
        .map((node): [string, string[]] => [node, path]);
      queue.push(...destinations);
    }
    visited.add(currentNode);
  }
}

transformer("./inputs/12.txt", async (readlines) => {
  const { start, end, graph } = await parse(readlines);
  const shortestPath = bfs(start, end, graph);
  if (!shortestPath) throw new Error("No path found");
  return shortestPath.length.toString();
});
