import { resolve, dirname } from "path";
import { chain, countBy, entries, shuffle, values } from "Lodash";
import { Cell, Select, Table } from "Cliffy";
import { Result } from "#types.ts";
import { writeJSON } from "#utils/writeJSON.ts";

enum MonitorActions {
  Skip = "⏩ Skip for now",
  LooksGood = "✅ Looks good to me!",
  TooLong = "⛔️ Too long",
  BadFormat = "⛔️ Bad format",
  GenericOutput = "⛔️ Generic output",
}
type ResultWithAction = Result & { action: MonitorActions };

export async function monitor(
  results: Result[],
  outDir: string,
) {
  const shuffledResults = shuffle(results);
  const skippedResults: Result[] = [];
  const finalResults: ResultWithAction[] = [];

  for (const result of shuffledResults) {
    new Table()
      .body([
        ["Progress", `${finalResults.length}/${shuffledResults.length}`],
        ["Input", new Cell(result.input.text).border(true)],
        ["Output", new Cell(result.output.text).border(true)],
        ["Characters", result.metadata.characters],
      ])
      .padding(1)
      .indent(2)
      .maxColWidth(80)
      .render();

    const action = (await Select.prompt({
      message: "Quality",
      options: values(MonitorActions),
    })) as MonitorActions;

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
    new Table()
      .body([
        ["Progress", `${finalResults.length}/${shuffledResults.length}`],
        ["Input", new Cell(result.input.text).border(true)],
        ["Output", new Cell(result.output.text).border(true)],
        ["Characters", result.metadata.characters],
      ])
      .padding(1)
      .indent(2)
      .maxColWidth(80)
      .render();

    const action = (await Select.prompt({
      message: "Quality",
      options: values(MonitorActions).filter((action) =>
        action !== MonitorActions.Skip
      ),
    })) as MonitorActions;
    finalResults.push({ ...result, action });
  }

  writeJSON(`${outDir}/results.json`, finalResults, {
    showWritingMessage: true,
  });

  // FIXME: check if finalResults gets mutated here
  const allCounts = chain(finalResults).groupBy("prompt.text").mapValues((
    actionList,
  ) => countBy(actionList, "action")).value();

  writeJSON(`${outDir}/results_easy.json`, allCounts, {
    showWritingMessage: true,
  });

  new Table()
    .header([
      "Prompt",
      MonitorActions.LooksGood,
      MonitorActions.TooLong,
      MonitorActions.BadFormat,
      MonitorActions.GenericOutput,
    ])
    .body(
      entries(allCounts).map((
        [text, action],
      ) => [
        text,
        action[MonitorActions.LooksGood] ?? 0,
        action[MonitorActions.TooLong] ?? 0,
        action[MonitorActions.BadFormat] ?? 0,
        action[MonitorActions.GenericOutput] ?? 0,
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
  if (!args.inspect) {
    console.error(
      "Please provide a path to a raw.json file using --inspect flag",
    );
    Deno.exit(1);
  }
  const results = await loadResults(resolve(args.inspect));
  await monitor(results, dirname(args.inspect));
}
