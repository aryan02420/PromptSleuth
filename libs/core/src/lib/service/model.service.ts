import { ModelEntity } from '../entity/index.ts';
import { NumberParam } from './param.service.ts';

export class OpenAIChatGptThreeDotFiveTurboModel extends ModelEntity<readonly [NumberParam, NumberParam, NumberParam, NumberParam, NumberParam]> {
  constructor() {
    super("openai-chat-gpt-3.5-turbo", [
      new NumberParam("temperature", 0.7, 0, 2, 0.01),
      new NumberParam("max_tokens", 150, 1, 2048, 1),
      new NumberParam("top_p", 1, 0, 1, 0.01), 
      new NumberParam("frequency_penalty", 0.5, 0, 2, 0.01),
      new NumberParam("presence_penalty", 0.5, 0, 2, 0.01),
    ] as const);
  }
}

export class OpenAIChatGptFourModel extends ModelEntity<readonly [NumberParam, NumberParam, NumberParam, NumberParam, NumberParam]> {
  constructor() {
    super("openai-chat-gpt-4", [
      new NumberParam("temperature", 0.7, 0, 2, 0.01),
      new NumberParam("max_tokens", 150, 1, 2048, 1),
      new NumberParam("top_p", 1, 0, 1, 0.01),
      new NumberParam("frequency_penalty", 0.5, 0, 2, 0.01),
      new NumberParam("presence_penalty", 0.5, 0, 2, 0.01),
    ] as const);
  }
}