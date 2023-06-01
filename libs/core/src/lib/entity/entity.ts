import { ObjectId } from "bson";

export class Entity {
  #id: string;
  #type: string;

  constructor() {
    this.#id = new ObjectId().toHexString();
    this.#type = this.constructor.name;
  }

  toString(): string {
    return `${this.#type}:${this.#id}`;
  }

  toJSON() {
    return {
      _id: this.#id,
      _type: this.#type,
    };
  }
}
