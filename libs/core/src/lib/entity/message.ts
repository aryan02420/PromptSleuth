import { Entity } from "./entity.ts";

type Role = "system" | "user" | "assistant";

export class Message extends Entity {
  private _role: Role;
  private _content: string;

  constructor(role: Role, content: string) {
    super();
    this._role = role;
    this._content = content;
  }
  
  get role() {
    return this._role;
  }
  
  set role(role: Role) {
    this._role = role;
    this.update();
  }

  get content() {
    return this._content;
  }
  
  set content(content: string) {
    this._content = content;
    this.update();
  }

  override toString() {
    return `${this._role}: ${encodeURIComponent(this._content)}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      role: this._role,
      content: this._content,
    };
  }
}
