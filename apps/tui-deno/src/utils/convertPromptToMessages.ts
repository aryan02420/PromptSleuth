import { ChatCompletionOptionMessage } from "tui-deno/types.ts";

export function convertPromptToMessages(
  prompt: string,
): ChatCompletionOptionMessage[] {
  return [{
    role: "user",
    content: prompt,
  }];
}
