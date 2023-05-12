import { ChatCompletion, ChatCompletionOptions } from "OpenAI";

export type UserInput = string[];

export type CommonParams =
  | "maxTokens"
  | "temperature"
  | "topP"
  | "frequencyPenalty"
  | "presencePenalty"
  | "stop";

export type ChatCompletionParams = Pick<ChatCompletionOptions, CommonParams>;

export type CompletionOptionPrompt = string;

export type ChatCompletionOptionMessage =
  ChatCompletionOptions["messages"][number];

export const MonitorActions = {
  Skip: "⏩ Skip for now",
  LooksGood: "✅ Looks good to me!",
  TooLong: "⛔️ Too long",
  BadFormat: "⛔️ Bad format",
  GenericOutput: "⛔️ Generic output",
  Moderated: "💀 Moderated",
} as const;

export type MonitorAction = typeof MonitorActions[keyof typeof MonitorActions];

export type Prompt = {
  id: string;
  messages: ChatCompletionOptionMessage[];
  params: ChatCompletionParams;
};

export type Input = {
  id: string;
  fields: string[];
};

export type Config = {
  name: string;
  prompts: Prompt[];
  inputs: Input[];
  repeats: number;
  // FIXME: remove string from return type
  validator: (
    result: Result,
    actions: typeof MonitorActions,
  ) => MonitorAction | undefined | string;
};

export type Output = {
  id: string;
  completion: ChatCompletion;
  metadata: {
    prompt: Prompt;
    input: Input;
    repeat: number;
  };
};

export type Result = {
  id: string;
  input: {
    id: string;
    text: string;
  };
  output: {
    id: string;
    text: string;
  };
  prompt: {
    id: string;
    text: string;
  };
  metadata: {
    tokens: number;
    characters: number;
    lengthExceeded: boolean;
    moderated: boolean;
  };
  validator: Config["validator"];
};
