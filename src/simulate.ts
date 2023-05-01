import ProgressBar from "Progress";
import { chunk } from "Lodash";
import { driveChatCompletion } from "./drive.ts";
import { probeChatCompletion } from "./probe.ts";
import { Input, Prompt, Result } from "#types.ts";

export async function simulateChatCompletion(
  prompts: Prompt[],
  inputs: Input[],
  repeat: number,
): Promise<Result[]> {
  const allCompletionRequests = prompts.flatMap(
    (prompt) => {
      return inputs.flatMap((input) => {
        return Array.from({ length: repeat }).fill(null).map((_, index) => {
          return { prompt, input, repeat: index };
        });
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
        const output = await driveChatCompletion(prompt, input, repeat)
        const result = probeChatCompletion(output);
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
