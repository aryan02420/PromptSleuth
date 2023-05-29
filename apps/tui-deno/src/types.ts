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
  Skip: "Skip",
  Unknown: "Unknown",
  LooksGood: "LooksGood",
  TooLong: "TooLong",
  BadFormat: "BadFormat",
  ExtraContent: "ExtraContent",
  CountError: "CountError",
  Inaccurate: "Inaccurate",
  GenericOutput: "GenericOutput",
  TooSlow: "TooSlow",
  Moderated: "Moderated",
} as const;

export type MonitorAction = keyof typeof MonitorActions;

export type Prompt = {
  id: string;
  messages: ChatCompletionOptionMessage[];
  params: ChatCompletionParams;
};

export type Input = {
  id: string;
  fields: string[];
};

export type CompletionMetadata = {
  tokens: number;
  characters: number;
  lengthExceeded: boolean;
  moderated: boolean;
  // time: number;
};

export type OutputProcessor = {
  validator: (
    rawCompletion: string,
    completionMetadata: CompletionMetadata,
    actions: typeof MonitorActions,
  ) => MonitorAction;
  parser: (
    tokenStream: Generator<string, void, undefined>,
    rawCompletion: string,
    // deno-lint-ignore no-explicit-any
  ) => string | Record<string, any> | Array<any>;
};

export type Config = {
  name: string;
  prompts: (Prompt & OutputProcessor)[];
  inputs: Input[];
  repeats: number;
};

export type Output = {
  id: string;
  completion: ChatCompletion;
  for: {
    prompt: Prompt & OutputProcessor;
    input: Input;
    repeat: number;
  };
};

export type Result = {
  id: string;
  prompt: {
    id: string;
    text: string;
  };
  input: {
    id: string;
    text: string;
  };
  output: {
    id: string;
    raw: string;
    // deno-lint-ignore no-explicit-any
    parsed: string | Record<string, any> | Array<any>;
    metadata: CompletionMetadata;
  };
  action: MonitorAction;
};
