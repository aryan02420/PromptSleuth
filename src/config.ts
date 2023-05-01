import { z } from "Zod";
import { stringID } from "#utils/stringID.ts";
import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";
import { Config } from "#types.ts";

const configSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  prompts: z.array(z.object({
    id: z.string().optional(),
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })),
    params: z.object({
      maxTokens: z.number().int().min(1).max(2048),
      temperature: z.number().min(0).max(1),
      topP: z.number().min(0).max(1),
      frequencyPenalty: z.number().min(0).max(2),
      presencePenalty: z.number().min(0).max(2),
    }),
  })),
  inputs: z.array(z.object({
    id: z.string().optional(),
    fields: z.array(z.string()),
  })),
  repeats: z.number().int().min(1),
});

type PartialConfig = z.infer<typeof configSchema>;

function validateConfig(config: unknown): PartialConfig {
  return configSchema.parse(config);
}

async function getRequiredConfig(config: PartialConfig): Promise<Config> {
  for (const prompt of config.prompts) {
    prompt.id ??= await stringID(convertMessagesToPrompt(prompt.messages));
  }
  for (const input of config.inputs) {
    input.id ??= await stringID(input.fields.join("\\"));
  }
  delete config.$schema;
  // FIXME: remove typecast
  return config as Config;
}

export async function loadConfig(path: string): Promise<Config> {
  const data = await Deno.readTextFile(path);
  const config = JSON.parse(data);
  return getRequiredConfig(validateConfig(config));
}

// generate schema is script is run directly
if (import.meta.main) {
  const { dirname, fromFileUrl, resolve } = await import("path");
  const { zodToJsonSchema } = await import("ZodToJsonSchema");
  const { writeJSON } = await import("#utils/writeJSON.ts");

  // @ts-ignore super deep type makes editor slow :(
  // deno-lint-ignore no-explicit-any
  const data: any = zodToJsonSchema(configSchema);
  const basePath = dirname(fromFileUrl(import.meta.url));
  writeJSON(resolve(basePath, "../stubs/schema.json"), data, {
    showWritingMessage: true,
  });
}
