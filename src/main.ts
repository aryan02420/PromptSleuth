import { dirname, resolve } from "path";
import { Confirm } from "Cliffy";
import { writeJSON } from "#utils/writeJSON.ts";
import { loadResults } from "#utils/loadResults.ts";
import { simulateChatCompletion } from "./simulate.ts";
import { monitor } from "./monitor.ts";
import { loadConfig } from "./config.ts";
import { parseArgs } from "./args.ts";

const args = parseArgs();
const command = args._[0];

// TODO: refactor using commands pattern?
if (command === "inspect") {
  const inspectFile = args._[1];
  if (!inspectFile) {
    console.error(`Please provide a path to a raw.json file. Usage:
      ${Deno.execPath()} inspect <raw.json>`);
    Deno.exit(1);
  }
  const results = await loadResults(resolve(inspectFile));
  await monitor(results, dirname(inspectFile));
  Deno.exit(0);
}

const configFile = args._[0];

if (!configFile) {
  console.error(`Config file path is required. Usage:
  ${Deno.execPath()} <config-file-path>`);
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
  ${Deno.execPath()} inspect ${tmpDir}/raw.json`);
}
