import { sprintf } from "fmt/printf.ts";
import openai from "#utils/openai.ts";
import {
  ChatCompletionOptionMessage,
  ChatCompletionParams,
  ChatCompletionWithMetadata,
  CompletionOptionPrompt,
  CompletionParams,
  CompletionWithMetadata,
  UserInput,
} from "#types.ts";
import { stringID } from "#utils/stringID.ts";
import { convertMessagesToPrompt } from "#utils/convertMessagesToPrompt.ts";

export async function driveCompletion(
  prompt: CompletionOptionPrompt,
  userInput: UserInput,
  options: CompletionParams,
  repeat: number,
): Promise<CompletionWithMetadata> {
  const promptId = await stringID(prompt);
  const inputId = await stringID(userInput.join("\\"));

  const promptWithUserInput = sprintf(prompt, ...userInput);

  const completion = await openai.createCompletion({
    prompt: promptWithUserInput,
    model: "text-davinci-003",
    logprobs: 5,
    ...options,
  });

  return {
    promptWithUserInput,
    options,
    completion,
    metadata: {
      prompt,
      userInput,
      promptId,
      inputId,
      repeat,
    },
  };
}

export async function driveChatCompletion(
  messages: ChatCompletionOptionMessage[],
  userInput: UserInput,
  options: ChatCompletionParams,
  repeat: number,
): Promise<ChatCompletionWithMetadata> {
  const messageId = await stringID(convertMessagesToPrompt(messages));
  const inputId = await stringID(userInput.join("\\"));

  const messagesWithUserInput = [
    ...messages.slice(0, -1),
    {
      // FIXME: remove non null assertion
      content: sprintf(messages.at(-1)!.content, ...userInput),
      role: messages.at(-1)!.role,
    },
  ];

  const completion = await openai.createChatCompletion({
    messages: messagesWithUserInput,
    model: "gpt-3.5-turbo",
    ...options,
  });

  return {
    messagesWithUserInput,
    options,
    completion,
    metadata: {
      messages,
      userInput,
      messageId,
      inputId,
      repeat,
    },
  };
}
