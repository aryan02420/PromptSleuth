import { Entity } from "./entity.ts";

type Role = "system" | "user" | "assistant";

export class Message extends Entity {
  #role: Role;
  #content: string;

  constructor(role: Role, content: string) {
    super();
    this.#role = role;
    this.#content = content;
  }
  
  get role() {
    return this.#role;
  }
  
  set role(role: Role) {
    this.#role = role;
    this.update();
  }

  get content() {
    return this.#content;
  }
  
  set content(content: string) {
    this.#content = content;
    this.update();
  }

  override toString() {
    return `${this.#role}: ${encodeURIComponent(this.#content)}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      role: this.#role,
      content: this.#content,
    };
  }
}
