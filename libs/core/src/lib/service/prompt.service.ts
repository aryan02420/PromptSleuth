import { MessageEntity, PromptEntity, TagEntity } from '../entity/index.ts';
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
    this.messages.push(new MessageEntity("user", ""));
    this.update();
  }

  removeMessage(index: number) {
    this.messages.splice(index, 1);
    if (this.messages.length === 0) {
      this.addMessage();
    }
    this.update();
  }

  addTag(tag: TagEntity) {
    this.tags.add(tag);
  }

  removeTag(tag: TagEntity) {
    this.tags.delete(tag);
  }

  hasTag(id: string) {
    return Array.from(this.tags).some((tag) => tag.id === id);
  }
}