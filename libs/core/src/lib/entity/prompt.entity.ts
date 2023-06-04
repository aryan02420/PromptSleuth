import { BaseEntity } from "./base.entity.js";
import { MessageEntity } from './message.entity.js';
import { ModelEntity } from './model.entity.js';

export class PromptEntity extends BaseEntity {
  private _model: ModelEntity;
  private _messages: MessageEntity[];

  constructor(model: ModelEntity) {
    super();
    this._model = model;
    this._messages = [];
  }
  
  get model() {
    return this._model;
  }

  set model(model: ModelEntity) {
    this._model = model;
    this.update();
  }

  get messages() {
    return this._messages;
  }

  addMessage(message: MessageEntity) {
    this._messages.push(message);
    this.update();
  }

  removeMessage(message: MessageEntity) {
    this._messages = this._messages.filter((m) => m !== message);
    this.update();
  }

  override toString() {
    return `${this._model.toString()}\n${this._messages.map((message) => message.toString()).join("\n")}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      model: this._model.toJSON(),
      messages: this._messages.map((message) => message.toJSON()),
    };
  }
}
