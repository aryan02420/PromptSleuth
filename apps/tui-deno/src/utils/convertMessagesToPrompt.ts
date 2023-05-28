import { ChatCompletionOptionMessage, CompletionOptionPrompt } from "tui-deno/types.ts";

export function convertMessagesToPrompt(
  messages: ChatCompletionOptionMessage[],
): CompletionOptionPrompt {
  return messages.map((message) => `${message.role}: ${message.content}`).join(
    "\n\n",
  ) + "\n\nassistant:";
}
