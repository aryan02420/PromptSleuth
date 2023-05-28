import { CompletionOptionPrompt } from "tui-deno/types.ts";

export function isSimplePrompt(
  prompt: CompletionOptionPrompt,
): prompt is string {
  return typeof prompt === "string";
}
