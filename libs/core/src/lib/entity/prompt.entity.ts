import { BaseEntity } from "./base.entity.ts";
import { MessageEntity } from './message.entity.ts';
import { ModelEntity } from './model.entity.ts';

export class PromptEntity<TModel extends ModelEntity = ModelEntity> extends BaseEntity {
  protected _model: TModel;
  protected _messages: MessageEntity[];

  constructor(model: TModel, messages: MessageEntity[]) { 
    super();
    this._model = model;
    this._messages = messages;
  }
  
  get model() {
    return this._model;
  }

  set model(model: TModel) {
    this._model = model;
    this.update();
  }

  get messages() {
    return this._messages;
  }

  set messages(messages: MessageEntity[]) {
    this._messages = messages;
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
