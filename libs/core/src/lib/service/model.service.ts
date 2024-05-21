import { ModelEntity } from '../entity/index.ts';
import { NumberParam } from './param.service.ts';

export class StupidModel extends ModelEntity<readonly [NumberParam]> {
  constructor() {
    super("stupid", "A very stupid model", [
      new NumberParam("stupidness", "How stupid the model should be", 0, 0, 100, 1),
    ] as const);
  }
}

export class OpenAIChatGptThreeDotFiveTurboModel extends ModelEntity<readonly [NumberParam, NumberParam, NumberParam, NumberParam, NumberParam]> {
  constructor() {
    super("openai-chat-gpt-3.5-turbo", "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. 4,096 tokens.	Up to Sep 2021.", [
      new NumberParam("temperature", "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both.", 0.7, 0, 2, 0.01),
      new NumberParam("max_tokens", "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.", 256, 1, 4095, 1),
      new NumberParam("top_p", "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.", 1, 0, 1, 0.01), 
      new NumberParam("frequency_penalty", "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.", 0.5, 0, 2, 0.01),
      new NumberParam("presence_penalty", "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.", 0.5, 0, 2, 0.01),
    ] as const);
  }
}

export class OpenAIChatGptFourModel extends ModelEntity<readonly [NumberParam, NumberParam, NumberParam, NumberParam, NumberParam]> {
  constructor() {
    super("openai-chat-gpt-4", "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. 8,192 tokens. Up to Sep 2021.", [
      new NumberParam("temperature", "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both.", 0.7, 0, 2, 0.01),
      new NumberParam("max_tokens", "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.", 256, 1, 4095, 1),
      new NumberParam("top_p", "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.", 1, 0, 1, 0.01), 
      new NumberParam("frequency_penalty", "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.", 0.5, 0, 2, 0.01),
      new NumberParam("presence_penalty", "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.", 0.5, 0, 2, 0.01),
    ] as const);
  }
}