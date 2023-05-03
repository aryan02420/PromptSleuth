import ProgressBar from "Progress";
import { chunk } from "Lodash";
import { driveChatCompletion } from "./drive.ts";
import { probeChatCompletion } from "./probe.ts";
import { Config, Result } from "#types.ts";

export async function simulateChatCompletion(
  config: Config,
): Promise<Result[]> {
  console.log(123, { config });
  const allCompletionRequests = config.prompts.flatMap(
    (prompt) => {
      return config.inputs.flatMap((input) => {
        return Array.from({ length: config.repeats }).fill(null).map(
          (_, index) => {
            return { prompt, input, repeat: index };
          },
        );
      });
    },
  );

  const completionRequestsChunks = chunk(allCompletionRequests, 6);
  const allReports: Result[] = [];

  console.clear();
  const progress = new ProgressBar({
    title: `Simulating ${allCompletionRequests.length} chat completions`,
    total: allCompletionRequests.length,
  });
  let completed = 0;

  function updateProgress() {
    progress.render(completed);
  }

  for (const chunk of completionRequestsChunks) {
    const interval = setInterval(updateProgress, 100);

    const reports = (await Promise.allSettled(
      chunk.map(async ({ prompt, input, repeat }) => {
        const output = await driveChatCompletion(prompt, input, repeat);
        const result = probeChatCompletion(output, config);
        completed++;
        updateProgress();
        return result;
      }),
    )).reduce<Result[]>((acc, result) => {
      if (result.status === "fulfilled") {
        acc.push(result.value);
      }
      return acc;
    }, []);

    allReports.push(...reports);
    clearInterval(interval);
  }

  updateProgress();

  return allReports;
}
