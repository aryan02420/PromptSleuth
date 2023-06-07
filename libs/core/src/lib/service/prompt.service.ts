import { MessageEntity, PromptEntity } from '../entity/index.ts';
import { OpenAIChatGptFourModel, OpenAIChatGptThreeDotFiveTurboModel } from './model.service.ts';


export class Prompt extends PromptEntity<OpenAIChatGptThreeDotFiveTurboModel | OpenAIChatGptFourModel> {
  private static _availableModels = [
    new OpenAIChatGptThreeDotFiveTurboModel(),
    new OpenAIChatGptFourModel(),
  ];

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(Prompt._availableModels[0]!, [
      new MessageEntity("user", ""),
    ]);
  }

  listModels() {
    return Prompt._availableModels;
  }

  addMessage() {
    this._messages.push(new MessageEntity("user", ""));
    this.update();
  }

  removeMessage(index: number) {
    this._messages.splice(index, 1);
    if (this._messages.length === 0) {
      this.addMessage();
    }
    this.update();
  }
}