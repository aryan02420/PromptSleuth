import { ParamEntity } from '../entity/index.ts';

export class StringParam extends ParamEntity<string> {
  private _minLength: number;
  private _maxLength: number;

  constructor(name: string, description: string, defaultValue: string, minLength: number, maxLength: number) {
    super(name, description, defaultValue);
    this._minLength = minLength;
    this._maxLength = maxLength;
  }

  get minLength() {
    return this._minLength;
  }

  get maxLength() {
    return this._maxLength;
  }

  override get value(): string {
    return super.value as string;
  }

  override set value(value: string) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
    if (value.length < this._minLength || value.length > this._maxLength) {
      throw new Error(`Value must be between ${this._minLength} and ${this._maxLength} characters`);
    }
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      minLength: this._minLength,
      maxLength: this._maxLength,
    };
  }
}

export class NumberParam extends ParamEntity<number> {
  private _min: number;
  private _max: number;
  private _step: number;

  constructor(name: string, description: string, defaultValue: number, min: number, max: number, step: number) {
    super(name, description, defaultValue);
    this._min = min;
    this._max = max;
    this._step = step;
  }

  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  get step() {
    return this._step;
  }

  override get value(): number {
    return super.value as number;
  }

  override set value(value: number) {
    if (typeof value !== "number") {
      throw new Error("Value must be a number");
    }
    if (value < this._min || value > this._max) {
      throw new Error(`Value must be between ${this._min} and ${this._max}`);
    }
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      min: this._min,
      max: this._max,
    };
  }
}

export class BooleanParam extends ParamEntity<boolean> {
  constructor(name: string, description: string, defaultValue: boolean) {
    super(name, description, defaultValue);
  }

  override get value(): boolean {
    return super.value as boolean;
  }

  override set value(value: boolean) {
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

export class ListParam extends ParamEntity<string[]> {
  private _listMinLength: number;
  private _listMaxLength: number;
  private _itemMinLength: number;
  private _itemMaxLength: number;

  constructor(name: string, description: string, defaultValue: string[], listMinLength: number, listMaxLength: number, itemMinLength: number, itemMaxLength: number) {
    super(name, description, defaultValue);
    this._listMinLength = listMinLength;
    this._listMaxLength = listMaxLength;
    this._itemMinLength = itemMinLength;
    this._itemMaxLength = itemMaxLength;
  }

  get listMinLength() {
    return this._listMinLength;
  }
  
  get listMaxLength() {
    return this._listMaxLength;
  }

  get itemMinLength() {
    return this._itemMinLength;
  }

  get itemMaxLength() {
    return this._itemMaxLength;
  }

  override get value(): string[] {
    return super.value as string[];
  }

  override set value(value: string[]) {
    if (!Array.isArray(value)) {
      throw new Error("Value must be an array");
    }
    if (value.some((item) => typeof item !== "string")) {
      throw new Error("Value must be an array of strings");
    }
    if (value.length < this._listMinLength || value.length > this._listMaxLength) {
      throw new Error(`Value must be between ${this._listMinLength} and ${this._listMaxLength} items`);
    }
    value.forEach((item) => {
      if (item.length < this._itemMinLength || item.length > this._itemMaxLength) {
        throw new Error(`Item must be between ${this._itemMinLength} and ${this._itemMaxLength} characters`);
      }
    });
    super.value = value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      listMinLength: this._listMinLength,
      listMaxLength: this._listMaxLength,
      itemMinLength: this._itemMinLength,
      itemMaxLength: this._itemMaxLength,
    };
  }
}
