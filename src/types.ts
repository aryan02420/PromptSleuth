import {
  ChatCompletion,
  ChatCompletionOptions,
  Completion,
  CompletionOptions,
} from "OpenAI";

// deno-lint-ignore no-explicit-any
export type UserInput = any[];

export type CommonParams =
  | "maxTokens"
  | "temperature"
  | "topP"
  | "frequencyPenalty"
  | "presencePenalty";

export type CompletionParams = Required<Pick<CompletionOptions, CommonParams>>;

export type ChatCompletionParams = Required<
  Pick<ChatCompletionOptions, CommonParams>
>;

export type CompletionOptionPrompt = string;

export type ChatCompletionOptionMessage =
  ChatCompletionOptions["messages"][number];

export type CompletionWithMetadata = {
  promptWithUserInput: CompletionOptionPrompt;
  options: CompletionParams;
  completion: Completion;
  metadata: {
    prompt: CompletionOptionPrompt;
    userInput: UserInput;
    promptId: string;
    inputId: string;
    repeat: number;
  };
};

export type ChatCompletionWithMetadata = {
  messagesWithUserInput: ChatCompletionOptionMessage[];
  options: ChatCompletionParams;
  completion: ChatCompletion;
  metadata: {
    messages: ChatCompletionOptionMessage[];
    userInput: UserInput;
    messageId: string;
    inputId: string;
    repeat: number;
  };
};

export type CompletionTaskOptions = {
  prompt: CompletionOptionPrompt;
  params: CompletionParams;
};

export type ChatCompletionTaskOptions = {
  messages: ChatCompletionOptionMessage[];
  params: ChatCompletionParams;
};

export type CompletionProbeResult = {
  id: string;
  input: string;
  output: string;
  tokens: number;
};

export type CompletionConfig = {
  id: string;
  prompt: CompletionTaskOptions[];
  inputs: UserInput[];
  repeats: number;
};

export type ChatCompletionConfig = {
  id: string;
  messages: ChatCompletionTaskOptions[];
  inputs: UserInput[];
  repeats: number;
};
