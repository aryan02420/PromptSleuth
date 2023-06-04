import { Entity } from "./entity.ts";

export class Input extends Entity {
  private _fields: string[];

  constructor(numberOfFields: number) {
    super();
    this._fields = new Array(numberOfFields).fill("");
  }
  
  get fields() {
    return this._fields;
  }

  set fields(fields: string[]) {
    this._fields = fields;
    this.update();
  }

  override toString() {
    return this._fields.map((field) => encodeURIComponent(field)).join("/");
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      fields: this._fields,
    };
  }
}
