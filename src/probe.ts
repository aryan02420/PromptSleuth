import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";
import { Config, Output, Result } from "#types.ts";

export function probeChatCompletion(
  data: Output,
  config: Config,
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
      lengthExceeded: data.completion.choices.at(0)!.finish_reason === "length",
      moderated: /as an ai language model/i.test(
        data.completion.choices.at(0)!.message.content,
      ),
    },
    validator: config.validator,
  };
}
