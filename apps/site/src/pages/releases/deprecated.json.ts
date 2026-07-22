import { readFile } from "node:fs/promises";

export async function GET(): Promise<Response> {
  const references = await readFile("./public/legacy-releases.json", {
    encoding: "utf-8",
  });

  return Response.json(JSON.parse(references));
}
