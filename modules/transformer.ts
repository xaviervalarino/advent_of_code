import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
import { writeAll } from "https://deno.land/std@0.167.0/streams/write_all.ts";

type TransformFunction = (input: AsyncIterableIterator<string>) => Promise<string>

export default async function pipeThrough(filename: string, callback: TransformFunction) {
  const encoder = new TextEncoder()
  const file = await Deno.open(filename);
  const transform = callback(readLines(file))
  await writeAll(Deno.stdout, encoder.encode(await transform))
  file.close();
}
