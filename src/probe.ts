import { decode as _decode, encode as _encode } from "Tokenizer";
import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";
import { MonitorActions, Output, Result } from "#types.ts";

function encode(text: string) {
  return _encode(text) as number[];
}

function decode(tokens: number[]) {
  return _decode(tokens) as string;
}

function* generateTokenStream(text: string) {
  yield* encode(text).map((token) => decode([token]));
}

export function probeChatCompletion(
  data: Output,
): Result {
  const { for: { prompt, input, repeat } } = data;

  // FIXME: remove non null assertion
  const rawCompletion = data.completion.choices.at(0)!.message.content;
  const completionMetadata = {
    tokens: data.completion.usage.total_tokens,
    // FIXME: remove non null assertion
    characters: rawCompletion.length,
    lengthExceeded: data.completion.choices.at(0)!.finish_reason === "length",
    moderated: /as an ai language model/i.test(rawCompletion),
  };

  const tokenStream = generateTokenStream(rawCompletion);

  return {
    id: `${prompt.id}-${input.id}-${repeat}`,
    input: {
      id: input.id,
      text: input.fields.join("\\"),
    },
    output: {
      id: data.id,
      // FIXME: remove non null assertion
      raw: rawCompletion,
      parsed: prompt.parser(tokenStream, rawCompletion),
      metadata: completionMetadata,
    },
    prompt: {
      id: prompt.id,
      text: convertMessagesToPrompt(prompt.messages),
    },
    // TODO: pass metadata as second argument
    action: prompt.validator(rawCompletion, completionMetadata, MonitorActions),
  };
}
