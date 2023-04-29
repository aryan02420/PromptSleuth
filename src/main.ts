import { Select } from "Cliffy";
import { keyBy, keys } from "Lodash";
import sampleConfig from "#config/sample.ts";
import { writeJSON } from "#utils/writeJSON.ts";
import { simulateChatCompletion } from "./simulate.ts";
import { monitor } from "./monitor.ts";

// TODO: configs should not be in source code
// load from a json file with $schema
const TESTS = keyBy([
  sampleConfig,
], "id");

const testId = await Select.prompt({
  message: "Which prompt to test?",
  options: keys(TESTS),
  search: true,
});
const test = TESTS[testId];

const result = await simulateChatCompletion(
  test.messages,
  test.inputs,
  test.repeats,
);

const tmpDir = await Deno.makeTempDir({ prefix: test.id });
writeJSON(`${tmpDir}/raw.json`, result, { showWritingMessage: true });

await monitor(result, tmpDir);
