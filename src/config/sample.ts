import { basename, fromFileUrl } from "path";
import {
  ChatCompletionConfig,
  ChatCompletionTaskOptions,
  UserInput,
} from "#types.ts";
import { convertPromptToMessages } from "../utils/convertPromptToMessages.ts";

const ID = basename(fromFileUrl(import.meta.url), ".ts");

const MESSAGES: ChatCompletionTaskOptions[] = [
  {
    messages: convertPromptToMessages(
      'Say "%s"',
    ),
    params: {
      maxTokens: 100,
      temperature: 0,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
  },
];

const INPUTS: UserInput[] = [
  ["World"],
  ["Universe"],
];

const REPEATS = 1;

const config: ChatCompletionConfig = {
  id: ID,
  messages: MESSAGES,
  inputs: INPUTS,
  repeats: REPEATS,
};

export default config;
