import { Entity } from "./entity.js";

type ParamType = string | number | boolean | string[];

export class Param<TValue extends ParamType = ParamType> extends Entity {
  #name: string;
  #defaultValue: TValue;
  #value: TValue;

  constructor(name: string, defaultValue: TValue) {
    super();
    this.#name = name;
    this.#defaultValue = defaultValue;
    this.#value = defaultValue;
  }
  
  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  set value(value: unknown) {
    if (typeof value !== typeof this.#defaultValue) {
      throw new Error(`Value must be a ${typeof this.#defaultValue}`);
    }
    this.#value = value as TValue;
    this.update();
  }

  reset() {
    this.#value = this.#defaultValue;
    this.update();
  }

  override toString() {
    return `${this.#name}:${this.#value}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      value: this.#value,
    };
  }
}

export class StringParam extends Param<string> {
  #minLength: number;
  #maxLength: number;

  constructor(name: string, defaultValue: string, minLength: number, maxLength: number) {
    super(name, defaultValue);
    this.#minLength = minLength;
    this.#maxLength = maxLength;
  }

  override set value(value: ParamType) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
    if (value.length < this.#minLength || value.length > this.#maxLength) {
      throw new Error(`Value must be between ${this.#minLength} and ${this.#maxLength} characters`);
    }
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      minLength: this.#minLength,
      maxLength: this.#maxLength,
    };
  }
}

export class NumberParam extends Param<number> {
  #min: number;
  #max: number;

  constructor(name: string, defaultValue: number, min: number, max: number) {
    super(name, defaultValue);
    this.#min = min;
    this.#max = max;
  }

  override set value(value: unknown) {
    if (typeof value !== "number") {
      throw new Error("Value must be a number");
    }
    if (value < this.#min || value > this.#max) {
      throw new Error(`Value must be between ${this.#min} and ${this.#max}`);
    }
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      min: this.#min,
      max: this.#max,
    };
  }
}

export class BooleanParam extends Param<boolean> {
  constructor(name: string, defaultValue: boolean) {
    super(name, defaultValue);
  }

  override set value(value: unknown) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

export class ListParam extends Param<string[]> {
  #listMinLength: number;
  #listMaxLength: number;
  #itemMinLength: number;
  #itemMaxLength: number;

  constructor(name: string, defaultValue: string[], listMinLength: number, listMaxLength: number, itemMinLength: number, itemMaxLength: number) {
    super(name, defaultValue);
    this.#listMinLength = listMinLength;
    this.#listMaxLength = listMaxLength;
    this.#itemMinLength = itemMinLength;
    this.#itemMaxLength = itemMaxLength;
  }

  override set value(value: unknown) {
    if (!Array.isArray(value)) {
      throw new Error("Value must be an array");
    }
    if (value.some((item) => typeof item !== "string")) {
      throw new Error("Value must be an array of strings");
    }
    if (value.length < this.#listMinLength || value.length > this.#listMaxLength) {
      throw new Error(`Value must be between ${this.#listMinLength} and ${this.#listMaxLength} items`);
    }
    value.forEach((item) => {
      if (item.length < this.#itemMinLength || item.length > this.#itemMaxLength) {
        throw new Error(`Item must be between ${this.#itemMinLength} and ${this.#itemMaxLength} characters`);
      }
    });
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      listMinLength: this.#listMinLength,
      listMaxLength: this.#listMaxLength,
      itemMinLength: this.#itemMinLength,
      itemMaxLength: this.#itemMaxLength,
    };
  }
}
