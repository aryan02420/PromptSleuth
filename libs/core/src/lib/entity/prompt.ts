import { Entity } from "./entity.ts";
import { Message } from './message.ts';
import { Model } from './model.ts';

export class Prompt extends Entity {
  private _model: Model;
  private _messages: Message[];

  constructor(model: Model) {
    super();
    this._model = model;
    this._messages = [];
  }
  
  get model() {
    return this._model;
  }

  set model(model: Model) {
    this._model = model;
    this.update();
  }

  get messages() {
    return this._messages;
  }

  addMessage(message: Message) {
    this._messages.push(message);
    this.update();
  }

  removeMessage(message: Message) {
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
