/*
 * Advent of Code
 * Day 12 - 2nd Solution
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
    const edges = testVertices(x, y)
      .filter((key) => {
        const testElevation = topography[key];
        return testElevation <= elevation + 1;
      })
      .map((edge) => edge.toString());
    graph.set(square, edges);
  }
  return graph;
}

async function parse(readlines: AsyncIterableIterator<string>) {
  const startPositions: string[] = [];
  let end!: string;
  const topography: Topography = {};
  let y = 0;
  for await (const line of readlines) {
    let x = 0;
    for (const l of line.split("")) {
      const key = `${x},${y}`;
      let elevation: number;
      if (l === "S" || l === "a") {
        startPositions.push(key);
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
  return { startPositions, end, graph };
}

function bfsShorterThan(graph: Map<string, string[]>) {
  // returns shorter path, or undefined if the found path is not shorter
  return (start: string, end: string, shortest: number) => {
    const queue: [string, string[]][] = [[start, []]];
    const visited = new Set<string>();

    while (queue.length) {
      const [currentNode, [...path]] = <[string, string[]]>queue.shift();
      // record this current node as part of the path used to get to destinations
      if (currentNode !== start) path.push(currentNode);
      // kill search if it's longer than the previous result
      if (path.length > shortest) return
      if (currentNode === end) return path;
      if (!visited.has(currentNode) && graph.has(currentNode)) {
        const destinations = graph
          .get(currentNode)!
          .map((node): [string, string[]] => [node, path]);
        queue.push(...destinations);
      }
      visited.add(currentNode);
    }
  };
}

transformer("./inputs/12.txt", async (readlines) => {
  const { startPositions, end, graph } = await parse(readlines);
  const bfs = bfsShorterThan(graph);
  const shortestPath = startPositions.reduce((shortest, start) => {
    const path = bfs(start, end, shortest)?.length;
    return path ? path : shortest;
  }, Infinity);
  return shortestPath.toString();
});
