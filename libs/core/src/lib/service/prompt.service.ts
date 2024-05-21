import { MessageEntity, ModelEntity, PromptEntity, TagEntity } from '../entity/index.ts';
import { OpenAIChatGptFourModel, OpenAIChatGptThreeDotFiveTurboModel, StupidModel } from './model.service.ts';


export class Prompt extends PromptEntity<ModelEntity> {
  private _availableModels: readonly ModelEntity[];

  constructor() {
    const availableModels = [
      new StupidModel(),
      new OpenAIChatGptThreeDotFiveTurboModel(),
      new OpenAIChatGptFourModel(),
    ] as const;
    super(availableModels[0], [
      new MessageEntity("user", ""),
    ]);
    this._availableModels = availableModels;
  }

  get availableModels() {
    return this._availableModels;
  }

  getModel(name: string) {
    return this._availableModels.find((model) => model.name === name);
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