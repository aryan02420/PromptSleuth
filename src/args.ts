import { parse } from "flags";
import { z } from "Zod";

const argSchema = z.object({
  _: z.array(z.string()),
  help: z.boolean().optional(),
  version: z.boolean().optional(),
  config: z.string().optional(),
  inspect: z.string().optional(),
});

type Args = z.infer<typeof argSchema>;

function validateArgs(args: unknown): Args {
  return argSchema.parse(args);
}

export function parseArgs(): Args {
  return validateArgs(parse(Deno.args));
}
