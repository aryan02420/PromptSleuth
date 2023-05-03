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
          ...chain(result.metadata).entries().map((
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
        options: chain(MonitorActions).entries().map(([value, name]) => ({
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
          ...chain(result.metadata).entries().map((
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
    .mapValues((result) => ({
      prompt: result[0].prompt,
      counts: countBy(result, "action"),
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
      ...values(MonitorActions).slice(1),
    ])
    .body(
      allCounts.map((
        [id, { prompt, counts }],
      ) => [
        id,
        prompt.text,
        ...chain(MonitorActions).keys().slice(1).map((key) => counts[key] ?? 0)
          .value(),
      ]),
    )
    .border(true)
    .padding(1)
    .indent(2)
    .maxColWidth(80)
    .render();
}
