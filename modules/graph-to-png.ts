import {
  createCanvas,
  // types
  EmulatedCanvas2D,
  EmulatedCanvas2DContext,
} from "https://deno.land/x/canvas/mod.ts";

type Gridmark = { x: number; y: number; symbol: string };

type Bounds = {
  lower: { x: number; y: number };
  upper: { x: number; y: number };
};

const MARGIN = 20;
const FONT = {
  name: "Menlo",
  path: "/System/Library/Fonts/Menlo.ttc",
  size: 12,
  width: 8,
  height: 12,
};

async function setupCanvas(
  graphWidth: number,
  graphHeight: number
): Promise<[EmulatedCanvas2D, EmulatedCanvas2DContext]> {
  // TODO: handle negative numbers
  const width = graphWidth * FONT.width + MARGIN * 2;
  const height = graphHeight * FONT.height + MARGIN * 2;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  canvas.loadFont(await Deno.readFile(FONT.path), { family: FONT.name });

  // Background color
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, width, height);

  // Text color
  ctx.fillStyle = "#f3f3f3";
  ctx.font = `${FONT.size}px ${FONT.name}`;

  return [canvas, ctx];
}

function getBounds(gridmarks: Gridmark[]) {
  return gridmarks.reduce(
    (bounds, mark) => {
      if (!bounds.lower.x || mark.x < bounds.lower.x) bounds.lower.x = mark.x;
      if (!bounds.upper.x || mark.x > bounds.upper.x) bounds.upper.x = mark.x;
      if (!bounds.lower.y || mark.y < bounds.lower.y) bounds.lower.y = mark.y;
      if (!bounds.upper.y || mark.y > bounds.upper.y) bounds.upper.y = mark.y;
      return bounds;
    },
    <Bounds>{ lower: {}, upper: {} }
  );
}

async function graphToPng(gridmarks: Gridmark[], outFile?: string) {
  const { lower, upper } = getBounds(gridmarks);
  const width = upper.x - lower.x;
  const height = upper.y - lower.y;
  const [canvas, ctx] = await setupCanvas(width, height);

  for (const mark of gridmarks) {
    const x = FONT.width * (mark.x - lower.x) + MARGIN;
    const y = FONT.height * (mark.y - lower.y) + MARGIN;
    ctx.fillText(mark.symbol, x, y);
  }
  await Deno.writeFile(outFile, canvas.toBuffer());
}

export default graphToPng;
