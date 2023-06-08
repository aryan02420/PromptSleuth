import { BaseEntity } from "./base.entity.ts";
import { MessageEntity } from './message.entity.ts';
import { ModelEntity } from './model.entity.ts';
import { TagEntity } from './tag.entity.ts';

export class PromptEntity<TModel extends ModelEntity = ModelEntity> extends BaseEntity {
  private _model: TModel;
  private _messages: MessageEntity[];
  private _tags: Set<TagEntity>;

  constructor(model: TModel, messages: MessageEntity[]) { 
    super();
    this._model = model;
    this._messages = messages;
    this._tags = new Set();
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

  get tags() {
    return this._tags;
  }

  set tags(tags: Set<TagEntity>) {
    this._tags = tags;
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
