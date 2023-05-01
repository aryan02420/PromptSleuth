import ProgressBar from "Progress";
import { chunk, entries } from "Lodash";
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
    title: "Simulating chat completion",
    total: completionRequestsChunks.length,
  });

  for (const [i, chunk] of entries(completionRequestsChunks)) {
    const interval = setInterval(() => {
      progress.render(+i);
    }, 100);

    const reports = (await Promise.allSettled(
      chunk.map(async ({ prompt, input, repeat }) => {
        return probeChatCompletion(
          await driveChatCompletion(prompt, input, repeat),
        );
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

  progress.render(completionRequestsChunks.length);

  return allReports;
}
