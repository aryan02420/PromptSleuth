import { sprintf } from "fmt/printf.ts";
import openai from "#utils/openai.ts";
import { Input, Output, OutputProcessor, Prompt } from "#types.ts";

export async function driveChatCompletion(
  prompt: Prompt & OutputProcessor,
  input: Input,
  repeat: number,
): Promise<Output> {
  const messagesWithUserInput = [
    ...prompt.messages.slice(0, -1),
    {
      // FIXME: remove non null assertion
      content: sprintf(prompt.messages.at(-1)!.content, ...input.fields),
      role: prompt.messages.at(-1)!.role,
    },
  ];

  const completion = await openai.createChatCompletion({
    messages: messagesWithUserInput,
    model: "gpt-3.5-turbo",
    ...prompt.params,
  });

  return {
    id: completion.id,
    completion,
    for: {
      prompt,
      input,
      repeat,
    },
  };
}
