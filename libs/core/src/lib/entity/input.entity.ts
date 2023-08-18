import { BaseEntity } from "./base.entity.js";

export class InputEntity extends BaseEntity {
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
