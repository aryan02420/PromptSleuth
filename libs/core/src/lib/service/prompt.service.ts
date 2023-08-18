import { MessageEntity, PromptEntity, TagEntity } from '../entity/index.ts';
import { OpenAIChatGptFourModel, OpenAIChatGptThreeDotFiveTurboModel } from './model.service.ts';


export class Prompt extends PromptEntity<OpenAIChatGptThreeDotFiveTurboModel | OpenAIChatGptFourModel> {
  private static _availableModels = [
    new OpenAIChatGptThreeDotFiveTurboModel(),
    new OpenAIChatGptFourModel(),
  ] as const;

  constructor() {
    super(Prompt._availableModels[0], [
      new MessageEntity("user", ""),
    ]);
  }

  get availableModels() {
    return Prompt._availableModels;
  }

  getModel(name: string) {
    return Prompt._availableModels.find((model) => model.name === name);
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