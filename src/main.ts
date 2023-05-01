import { writeJSON } from "#utils/writeJSON.ts";
import { simulateChatCompletion } from "./simulate.ts";
import { monitor } from "./monitor.ts";
import { loadConfig } from "./config.ts";
import { parseArgs } from "./args.ts";

const args = parseArgs();

if (!args.config) {
  console.error("config file is required. Use --config flag to specify one.");
  Deno.exit(1);
}

const test = await loadConfig(args.config);

const result = await simulateChatCompletion(
  test.prompts,
  test.inputs,
  test.repeats,
);

const totalTokens = result.reduce((tokens, res) => tokens + res.metadata.tokens, 0);
const cost = totalTokens * 0.002 / 1000;

console.log(`💰 Tokens consumed: ${totalTokens}, worth $${cost}`);

const tmpDir = await Deno.makeTempDir({ prefix: `${test.name.replaceAll(/[^\w-]/g, "")}_` });
writeJSON(`${tmpDir}/raw.json`, result, { showWritingMessage: true });


await monitor(result, tmpDir);
