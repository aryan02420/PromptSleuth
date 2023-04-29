import {
  ChatCompletionWithMetadata,
  CompletionProbeResult,
  CompletionWithMetadata,
} from "#types.ts";

export function probeCompletion(
  data: CompletionWithMetadata,
): CompletionProbeResult {
  const { metadata: { promptId, inputId, repeat, userInput } } = data;

  return {
    id: `${promptId}-${inputId}-${repeat}`,
    input: userInput.join("\\"),
    // FIXME: remove non null assertion
    output: data.completion.choices.at(0)!.text,
    tokens: data.completion.usage.total_tokens,
  };
}

export function probeChatCompletion(
  data: ChatCompletionWithMetadata,
): CompletionProbeResult {
  const { metadata: { messageId, inputId, repeat, userInput } } = data;

  return {
    id: `${messageId}-${inputId}-${repeat}`,
    input: userInput.join("\\"),
    // FIXME: remove non null assertion
    output: data.completion.choices.at(0)!.message.content,
    tokens: data.completion.usage.total_tokens,
  };
}
