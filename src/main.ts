import { resolve } from "path";
import { Confirm } from "Cliffy";
import { writeJSON } from "#utils/writeJSON.ts";
import { simulateChatCompletion } from "./simulate.ts";
import { monitor } from "./monitor.ts";
import { loadConfig } from "./config.ts";
import { parseArgs } from "./args.ts";

const args = parseArgs();
const configFile = args._[0];

if (!configFile) {
  console.error(`Config file path is required. Usage:
  ./testbench <config-file-path>`);
  Deno.exit(1);
}

const testConfig = await loadConfig(resolve(configFile));

const result = await simulateChatCompletion(testConfig);

const totalTokens = result.reduce(
  (tokens, res) => tokens + res.metadata.tokens,
  0,
);
const cost = totalTokens * 0.002 / 1000;

console.log(`💰 Tokens consumed: ${totalTokens}, worth $${cost}`);

const tmpDir = await Deno.makeTempDir({
  prefix: `${testConfig.name.replaceAll(/[^\w-]/g, "")}_`,
});
writeJSON(`${tmpDir}/raw.json`, result, { showWritingMessage: true });

const continueMonitoring = await Confirm.prompt("Continue with inspection?");

if (continueMonitoring) {
  await monitor(result, tmpDir);
} else {
  console.log(`Consider inspecting the results later with
  ./inspector ${tmpDir}/raw.json`);
}
