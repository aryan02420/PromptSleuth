import { ChatCompletionOptionMessage } from "#types.ts";

export function convertPromptToMessages(
  prompt: string,
): ChatCompletionOptionMessage[] {
  return [{
    role: "user",
    content: prompt,
  }];
}
