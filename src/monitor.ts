import { countBy, mapValues, merge, shuffle } from "Lodash";
import { Cell, Select, Table } from "Cliffy";
import { CompletionProbeResult } from "#types.ts";
import { writeJSON } from "./utils/writeJSON.ts";

type MonitorActions = "Good" | "Skip" | "Bad";

export async function monitor(
  results: CompletionProbeResult[],
  outDir: string,
) {
  const shuffledResults = shuffle(results);
  const skippedResults: CompletionProbeResult[] = [];
  const goodResults: CompletionProbeResult[] = [];
  const badResults: CompletionProbeResult[] = [];

  for (const result of shuffledResults) {
    new Table()
      .body([
        ["Input", new Cell(result.input).border(true)],
        ["Output", new Cell(result.output).border(true)],
      ])
      .padding(1)
      .indent(2)
      .maxColWidth(80)
      .render();

    const action = (await Select.prompt({
      message: "Quality",
      options: ["Good", "Skip", "Bad"],
    })) as MonitorActions;

    switch (action) {
      case "Good":
        goodResults.push(result);
        break;
      case "Skip":
        skippedResults.push(result);
        break;
      case "Bad":
        badResults.push(result);
        break;
    }
  }

  for (const result of skippedResults) {
    new Table()
      .body([
        ["Input", new Cell(result.input).border(true)],
        ["Output", new Cell(result.output).border(true)],
      ])
      .padding(1)
      .indent(2)
      .maxColWidth(80)
      .render();

    const action = (await Select.prompt({
      message: "Quality",
      options: ["Good", "Bad"],
    })) as MonitorActions;

    switch (action) {
      case "Good":
        goodResults.push(result);
        break;
      case "Bad":
        badResults.push(result);
        break;
    }
  }

  writeJSON(`${outDir}/good.json`, goodResults, { showWritingMessage: true });
  writeJSON(`${outDir}/bad.json`, badResults, { showWritingMessage: true });

  const goodCounts = mapValues(
    countBy(goodResults, "id"),
    (count) => ({ good: count }),
  );
  const badCounts = mapValues(
    countBy(badResults, "id"),
    (count) => ({ bad: count }),
  );
  // FIXME: looks like goodCounts gets mutated here
  const allCounts = mapValues(
    merge(goodCounts, badCounts),
    ({ good, bad }) => ({ good: good ?? 0, bad: bad ?? 0 }),
  );

  new Table()
    .header(["Prompt", "Good", "Bad"])
    .body(
      Object.entries(allCounts).map(([id, { good, bad }]) => [id, good, bad]),
    )
    .border(true)
    .padding(1)
    .indent(2)
    .maxColWidth(80)
    .render();
}
