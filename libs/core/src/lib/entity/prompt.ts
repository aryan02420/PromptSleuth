import { Entity } from "./entity.ts";
import { Message } from './message.ts';
import { Model } from './model.ts';

export class Prompt extends Entity {
  #model: Model;
  #messages: Message[];

  constructor(model: Model) {
    super();
    this.#model = model;
    this.#messages = [];
  }
  
  get model() {
    return this.#model;
  }

  set model(model: Model) {
    this.#model = model;
    this.update();
  }

  get messages() {
    return this.#messages;
  }

  addMessage(message: Message) {
    this.#messages.push(message);
    this.update();
  }

  removeMessage(message: Message) {
    this.#messages = this.#messages.filter((m) => m !== message);
    this.update();
  }

  override toString() {
    return `${this.#model.toString()}\n${this.#messages.map((message) => message.toString()).join("\n")}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      model: this.#model.toJSON(),
      messages: this.#messages.map((message) => message.toJSON()),
    };
  }
}
