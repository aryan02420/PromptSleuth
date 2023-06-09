import { chain, countBy, entries, shuffle, values } from "Lodash";
import { Cell, Select, Table } from "Cliffy";
import { MonitorAction, MonitorActions, Result } from "tui-deno/types.ts";
import { writeJSON } from "tui-deno/utils/writeJSON.ts";

type ResultWithAction = Result & { action: MonitorAction };

const monitorActionName: Record<MonitorAction, string> = {
  [MonitorActions.Skip]: "⏩ Skip for now",
  [MonitorActions.Unknown]: "❔Unknown",
  [MonitorActions.LooksGood]: "✅ Looks good to me!",
  [MonitorActions.TooLong]: "⛔️ Too long",
  [MonitorActions.BadFormat]: "⛔️ Bad format",
  [MonitorActions.ExtraContent]: "⛔️ Extra content",
  [MonitorActions.CountError]: "⛔️ Count error",
  [MonitorActions.Inaccurate]: "⛔️ Inaccurate",
  [MonitorActions.GenericOutput]: "⚠️ Generic output",
  [MonitorActions.TooSlow]: "⚠️ Too Slow",
  [MonitorActions.Moderated]: "💀 Moderated",
} as const;

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
          ["Input", new Cell(result.input.text).border(true).colSpan(2)],
          [
            "Output",
            new Cell(result.output.raw).border(true),
            new Cell(
              typeof result.output.parsed === "object"
                ? JSON.stringify(result.output.parsed, null, 2)
                : result.output.parsed,
            )
              .border(true),
          ],
          ...chain(result.output.metadata).entries().map((
            [key, value],
          ) => [key, value.toString()]).value(),
        ])
        .padding(1)
        .indent(2)
        .maxColWidth(80)
        .render();
      console.log();

      const defaultAction = result.action;
      const action = (await Select.prompt({
        message: "Quality",
        options: chain(monitorActionName).entries().map(([value, name]) => ({
          value,
          name,
        })).value(),
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
          ["Input", new Cell(result.input.text).border(true).colSpan(2)],
          [
            "Output",
            new Cell(result.output.raw).border(true),
            new Cell(
              typeof result.output.parsed === "object"
                ? JSON.stringify(result.output.parsed, null, 2)
                : result.output.parsed,
            )
              .border(true),
          ],
          ...chain(result.output.metadata).entries().map((
            [key, value],
          ) => [key, value.toString()]).value(),
        ])
        .padding(1)
        .indent(2)
        .maxColWidth(80)
        .render();
      console.log();

      const action = (await Select.prompt({
        message: "Quality",
        options: chain(monitorActionName).entries().slice(1).map((
          [value, name],
        ) => ({
          value,
          name,
        })).value(),
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
  const allCountsByPrompts = chain(allResults)
    .flatMap((x) => x)
    .groupBy("prompt.id")
    .mapValues((result) => ({
      prompt: result[0].prompt,
      counts: countBy(result, "action"),
    }))
    .entries()
    .sortBy(([_, { counts }]) => -counts[MonitorActions.LooksGood])
    .value();

  const allCountsByInputs = chain(allResults)
    .flatMap((x) => x)
    .groupBy("input.id")
    .mapValues((result) => ({
      input: result[0].input,
      counts: countBy(result, "action"),
    }))
    .entries()
    .sortBy(([_, { counts }]) => -counts[MonitorActions.LooksGood])
    .value();

  writeJSON(`${outDir}/results_prompts.json`, allCountsByPrompts, {
    showWritingMessage: true,
  });
  writeJSON(`${outDir}/results_inputs.json`, allCountsByInputs, {
    showWritingMessage: true,
  });

  const allActions = chain(allResults)
    .flatMap((x) => x)
    .countBy("action")
    .entries()
    .filter(([_, count]) => count > 0)
    .map(([action, _]) => action)
    .value();

  new Table()
    .header([
      "Prompt ID",
      "Prompt",
      ...allActions.map((key) =>
        monitorActionName[key as MonitorAction] ?? key
      ),
    ])
    .body(
      allCountsByPrompts.map((
        [id, { prompt, counts }],
      ) => [
        id,
        prompt.text,
        ...allActions.map((key) => counts[key] ?? 0),
      ]),
    )
    .border(true)
    .padding(1)
    .indent(2)
    .maxColWidth(80)
    .render();

  new Table()
    .header([
      "Input ID",
      "Input",
      ...allActions.map((key) =>
        monitorActionName[key as MonitorAction] ?? key
      ),
    ])
    .body(
      allCountsByInputs.map((
        [id, { input, counts }],
      ) => [
        id,
        input.text,
        ...allActions.map((key) => counts[key] ?? 0),
      ]),
    )
    .border(true)
    .padding(1)
    .indent(2)
    .maxColWidth(80)
    .render();
}
