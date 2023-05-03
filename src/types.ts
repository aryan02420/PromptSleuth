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
  ExtraContent: "⛔️ Extra content",
  CountError: "⛔️ Count error",
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
  // FIXME: replace any with Result.metadata type
  validator: (
    rawCompletion: string,
    metadata: any,
  ) => keyof typeof MonitorActions | undefined | string;
  // deno-lint-ignore no-explicit-any
  parser: (tokenStream: Generator<string, void, undefined>) => string | Record<string, any> | Array<any>;
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
    raw: string;
    // deno-lint-ignore no-explicit-any
    parsed: string | Record<string, any> | Array<any>;
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
  action?: keyof typeof MonitorActions | string | undefined;
};
