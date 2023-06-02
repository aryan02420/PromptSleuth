import { ObjectId } from "bson";

export class Entity {
  #id: string;
  #type: string;
  #createdAt: string;
  #updatedAt: string;

  constructor() {
    this.#createdAt = new Date().toISOString();
    this.#id = new ObjectId().toHexString();
    this.#type = this.constructor.name;
    this.#updatedAt = this.#createdAt;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  protected update() {
    this.#updatedAt = new Date().toISOString();
  }

  toString(): string {
    return `${this.#type}:${this.#id}`;
  }

  toJSON() {
    return {
      _id: this.#id,
      __typename: this.#type,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}
