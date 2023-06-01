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

  set role(role: Role) {
    this.#role = role;
  }

  get role() {
    return this.#role;
  }

  set content(content: string) {
    this.#content = content;
  }

  get content() {
    return this.#content;
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
