import { dirname, resolve } from "path";
import { chain, countBy, entries, shuffle, values } from "Lodash";
import { Cell, Select, Table } from "Cliffy";
import { MonitorAction, MonitorActions, Result } from "#types.ts";
import { writeJSON } from "#utils/writeJSON.ts";

type ResultWithAction = Result & { action: MonitorAction };

export async function monitor(
  results: Result[],
  outDir: string,
) {
  const groupedByInput = chain(results).groupBy("input.id").values().value();
  const allResults: typeof groupedByInput = [];

  for (const [inputIndex, results] of entries(groupedByInput)) {
    const shuffledResults = shuffle(results);
    const skippedResults: Result[] = [];
    const finalResults: ResultWithAction[] = [];

    for (const result of shuffledResults) {
      console.clear();
      new Table()
        .body([
          [
            "Progress",
            `Input: ${+inputIndex + 1}/${groupedByInput.length} Output: ${
              finalResults.length + 1
            }/${results.length}`,
          ],
          ["Input", new Cell(result.input.text).border(true)],
          ["Output", new Cell(result.output.text).border(true)],
          ...chain(result.metadata).entries().map((
            [key, value],
          ) => [key, value.toString()]).value(),
        ])
        .padding(1)
        .indent(2)
        .maxColWidth(80)
        .render();
      console.log();

      const defaultAction = result.validator(result, MonitorActions);
      const action = (await Select.prompt({
        message: "Quality",
        options: values(MonitorActions),
        default: defaultAction,
      })) as MonitorAction;

      switch (action) {
        case MonitorActions.Skip:
          skippedResults.push(result);
          break;
        default: {
          finalResults.push({ ...result, action });
          break;
        }
      }
    }

    for (const result of skippedResults) {
      console.clear();
      new Table()
        .body([
          [
            "Progress",
            `Input: ${inputIndex + 1}/${groupedByInput.length} Output: ${
              finalResults.length + 1
            }/${results.length}`,
          ],
          ["Input", new Cell(result.input.text).border(true)],
          ["Output", new Cell(result.output.text).border(true)],
        ])
        .padding(1)
        .indent(2)
        .maxColWidth(80)
        .render();
      console.log();

      const action = (await Select.prompt({
        message: "Quality",
        options: values(MonitorActions).filter((action) =>
          action !== MonitorActions.Skip
        ),
      })) as MonitorAction;
      finalResults.push({ ...result, action });
    }

    allResults.push(finalResults);
  }

  console.clear();
  writeJSON(`${outDir}/results.json`, allResults, {
    showWritingMessage: true,
  });

  // FIXME: check if finalResults gets mutated here
  const allCounts = chain(allResults)
    .flatMap((x) => x)
    .groupBy("prompt.id")
    .mapValues((actionList) => ({
      prompt: actionList[0].prompt,
      counts: countBy(actionList, "action"),
    }))
    .entries()
    .sortBy(([_, { counts }]) => -counts[MonitorActions.LooksGood])
    .value();

  writeJSON(`${outDir}/results_easy.json`, allCounts, {
    showWritingMessage: true,
  });

  new Table()
    .header([
      "Prompt ID",
      "Prompt",
      MonitorActions.LooksGood,
      MonitorActions.TooLong,
      MonitorActions.BadFormat,
      MonitorActions.GenericOutput,
      MonitorActions.Moderated,
    ])
    .body(
      allCounts.map((
        [id, { prompt, counts }],
      ) => [
        id,
        prompt.text,
        counts[MonitorActions.LooksGood] ?? 0,
        counts[MonitorActions.TooLong] ?? 0,
        counts[MonitorActions.BadFormat] ?? 0,
        counts[MonitorActions.GenericOutput] ?? 0,
        counts[MonitorActions.Moderated] ?? 0,
      ]),
    )
    .border(true)
    .padding(1)
    .indent(2)
    .maxColWidth(80)
    .render();
}

if (import.meta.main) {
  const { loadResults } = await import("#utils/loadResults.ts");
  const { parseArgs } = await import("./args.ts");

  const args = parseArgs();
  const inspectFile = args._[0];
  if (!inspectFile) {
    console.error(
      "Please provide a path to a raw.json file",
    );
    Deno.exit(1);
  }
  const results = await loadResults(resolve(inspectFile));
  await monitor(results, dirname(inspectFile));
}
