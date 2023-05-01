import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";
import { Output, Result } from "#types.ts";

export function probeChatCompletion(
  data: Output,
): Result {
  const { metadata: { prompt, input, repeat } } = data;

  return {
    id: `${prompt.id}-${input.id}-${repeat}`,
    input: {
      id: input.id,
      text: input.fields.join("\\"),
    },
    output: {
      id: data.id,
      // FIXME: remove non null assertion
      text: data.completion.choices.at(0)!.message.content,
    },
    prompt: {
      id: prompt.id,
      text: convertMessagesToPrompt(prompt.messages),
    },
    metadata: {
      tokens: data.completion.usage.total_tokens,
      // FIXME: remove non null assertion
      characters: data.completion.choices.at(0)!.message.content.length,
    },
  };
}
