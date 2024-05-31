import { BaseEntity } from "./base.entity.js";

const availableRoles = ["system", "user", "assistant"] as const;
type Role = typeof availableRoles[number];

export class MessageEntity extends BaseEntity {
  private _role: Role;
  private _content: string;

  constructor(role: Role, content: string) {
    super();
    this._role = role;
    this._content = content;
  }

  get availableRoles() {
    return availableRoles;
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
