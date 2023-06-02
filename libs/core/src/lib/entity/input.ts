import { Entity } from "./entity.js";

export class Input extends Entity {
  #fields: string[];

  constructor(numberOfFields: number) {
    super();
    this.#fields = new Array(numberOfFields).fill("");
  }
  
  get fields() {
    return this.#fields;
  }

  set fields(fields: string[]) {
    this.#fields = fields;
    this.update();
  }

  override toString() {
    return this.#fields.map((field) => encodeURIComponent(field)).join("/");
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      fields: this.#fields,
    };
  }
}
