import { BaseEntity } from "./base.entity.js";

type ParamType = string | number | boolean | string[];

export class ParamEntity<TValue extends ParamType = ParamType> extends BaseEntity {
  private _name: string;
  private _description: string;
  private _defaultValue: TValue;
  private _value: TValue;

  constructor(name: string, description: string, defaultValue: TValue) {
    super();
    this._name = name;
    this._description = description;
    this._defaultValue = defaultValue;
    this._value = defaultValue;
  }
  
  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get value() {
    return this._value;
  }

  set value(value: unknown) {
    if (typeof value !== typeof this._defaultValue) {
      throw new Error(`Value must be a ${typeof this._defaultValue}`);
    }
    this._value = value as TValue;
    this.update();
  }

  reset() {
    this._value = this._defaultValue;
    this.update();
  }

  override toString() {
    return `${this._name}:${this._value}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this._name,
      description: this._description,
      defaultValue: this._defaultValue,
      value: this._value,
    };
  }
}