import { decode as _decode, encode as _encode } from "Tokenizer";
import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";
import { Config, Output, Result } from "#types.ts";

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
  config: Config,
): Result {
  const { metadata: { prompt, input, repeat } } = data;

  // FIXME: remove non null assertion
  const rawCompletion = data.completion.choices.at(0)!.message.content;

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
      parsed: config.parser(tokenStream),
    },
    prompt: {
      id: prompt.id,
      text: convertMessagesToPrompt(prompt.messages),
    },
    metadata: {
      tokens: data.completion.usage.total_tokens,
      // FIXME: remove non null assertion
      characters: rawCompletion.length,
      lengthExceeded: data.completion.choices.at(0)!.finish_reason === "length",
      moderated: /as an ai language model/i.test(rawCompletion),
    },
    // TODO: pass metadata as second argument
    action: config.validator(rawCompletion, {}),
  };
}
