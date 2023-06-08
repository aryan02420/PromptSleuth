import { BaseEntity } from "./base.entity.js";

type Category = "Perfect" | "Ok" | "Neutral" | "Bad";

const categoryIcon: Record<Category, string> = {
  Perfect: "👍",
  Ok: "👌",
  Neutral: "🤷",
  Bad: "👎",
} as const;

export class TagEntity extends BaseEntity {
  private _name: string;
  private _value: string;
  private _category: Category;

  constructor(name: string, value: string, category: Category) {
    super();
    this._name = name;
    this._value = value;
    this._category = category;
  }
  
  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this.update();
  }

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.update();
  }

  get category() {
    return this._category;
  }

  set category(category: Category) {
    this._category = category;
    this.update();
  }

  override toString() {
    return `${categoryIcon[this._category]} ${this._name}:${this._value}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this._name,
      value: this._value,
      category: this._category,
    };
  }
}
