import ProgressBar from "Progress"
import { driveChatCompletion, driveCompletion } from "./drive.ts";
import { probeChatCompletion, probeCompletion } from "./probe.ts";
import {
  ChatCompletionTaskOptions,
  CompletionProbeResult,
  CompletionTaskOptions,
  UserInput,
} from "#types.ts";

export async function simulateCompletion(
  completionTaskOptions: CompletionTaskOptions[],
  inputs: UserInput[],
  repeat: number,
): Promise<CompletionProbeResult[]> {
  const allCompletionRequests = completionTaskOptions.flatMap(
    ({ prompt, params }) => {
      return inputs.flatMap((input) => {
        return Array.from({ length: repeat }).fill(null).map((_, index) => {
          return { prompt, input, params, index };
        });
      });
    },
  );

  const progressBar = new ProgressBar({
    title: 'Generating completions',
    complete: "#",
    incomplete: "-",
    display: "[:bar] :text :percent :time :completed/:total",
    total: allCompletionRequests.length,
  });
  progressBar.render(0);

  const allReports = (await Promise.allSettled(
    allCompletionRequests.map(async ({ prompt, input, params, index }) => {
      progressBar.render(index + 1);
      return probeCompletion(await driveCompletion(prompt, input, params, index))
  }),
  )).reduce<CompletionProbeResult[]>((acc, result) => {
    if (result.status === "fulfilled") {
      acc.push(result.value);
    }
    return acc;
  }, []);

  return allReports;
}

export async function simulateChatCompletion(
  completionTaskOptions: ChatCompletionTaskOptions[],
  inputs: UserInput[],
  repeat: number,
): Promise<CompletionProbeResult[]> {
  const allCompletionRequests = completionTaskOptions.flatMap(
    ({ messages, params }) => {
      return inputs.flatMap((input) => {
        return Array.from({ length: repeat }).fill(null).map((_, index) => {
          return { messages, input, params, index };
        });
      });
    },
  );

  // const progressBar = new ProgressBar({
  //   title: 'Generating completions',
  //   complete: "#",
  //   incomplete: "-",
  //   display: "[:bar] :text :percent :time :completed/:total",
  //   total: allCompletionRequests.length,
  // });
  // progressBar.render(0);

  const allReports = (await Promise.allSettled(
    allCompletionRequests.map(async ({ messages, input, params, index }) => {
      // progressBar.render(index + 1);
      console.log(`Generating completion ${index + 1} of ${allCompletionRequests.length}`);
      return probeChatCompletion(
        await driveChatCompletion(messages, input, params, index),
      )
    }),
  )).reduce<CompletionProbeResult[]>((acc, result) => {
    if (result.status === "fulfilled") {
      acc.push(result.value);
    }
    return acc;
  }, []);

  return allReports;
}
