import { z } from "Zod";
import { stringID } from "#utils/stringID.ts";
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
      maxTokens: z.number().int().min(1).max(2048).optional(),
      temperature: z.number().min(0).max(1).optional(),
      topP: z.number().min(0).max(1).optional(),
      frequencyPenalty: z.number().min(0).max(2).optional(),
      presencePenalty: z.number().min(0).max(2).optional(),
      stop: z.union([z.string(), z.array(z.string())]).optional(),
    }),
    // FIXME: use CompletionMetadata and MonitorActions instead of any
    validator: z.function(
      z.tuple([z.string(), z.record(z.any()), z.record(z.any())]),
      z.string().optional(),
    ),
    // FIXME: replace any with Generator<>
    parser: z.function(
      z.tuple([z.any(), z.string()]),
      z.string().or(z.record(z.any())).or(z.array(z.any())),
    ),
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
    prompt.id ??= await stringID(JSON.stringify(prompt));
  }
  for (const input of config.inputs) {
    input.id ??= await stringID(JSON.stringify(input));
  }
  delete config.$schema;
  // FIXME: remove typecast
  return config as Config;
}

export async function loadConfig(path: string): Promise<Config> {
  const { default: config } = await import(path);
  return getRequiredConfig(validateConfig(config));
}
