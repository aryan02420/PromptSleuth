import { ChatCompletionOptionMessage, CompletionOptionPrompt } from "#types.ts";

export function convertMessagesToPrompt(
  messages: ChatCompletionOptionMessage[],
): CompletionOptionPrompt {
  return messages.map((message) => `${message.role}: ${message.content}`).join(
    "\n\n",
  ) + "\n\nassistant:";
}
