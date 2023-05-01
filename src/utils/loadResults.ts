import { z } from "Zod";
import { Result } from "#types.ts";

const resultsSchema = z.array(z.object({
  id: z.string(),
  input: z.object({
    id: z.string(),
    text: z.string(),
  }),
  output: z.object({
    id: z.string(),
    text: z.string(),
  }),
  prompt: z.object({
    id: z.string(),
    text: z.string(),
  }),
  metadata: z.object({
    tokens: z.number(),
    characters: z.number(),
  }),
}));

function validateResults(results: unknown): Result[] {
  return resultsSchema.parse(results);
}

export async function loadResults(file: string): Promise<Result[]> {
  const content = await Deno.readTextFile(file);
  const data = JSON.parse(content);
  return validateResults(data);
}
