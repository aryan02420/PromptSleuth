import { BaseEntity } from "./base.entity.js";

type Category = "Perfect" | "Ok" | "Neutral" | "Bad";

const categoryIcon: Record<Category, string> = {
  Perfect: "👍",
  Ok: "👌",
  Neutral: "🤷",
  Bad: "👎",
} as const;

export class TagEntity extends BaseEntity {
  #name: string;
  #value: string;
  #category: Category;

  constructor(name: string, value: string, category: Category) {
    super();
    this.#name = name;
    this.#value = value;
    this.#category = category;
  }
  
  get name() {
    return this.#name;
  }

  set name(name: string) {
    this.#name = name;
    this.update();
  }

  get value() {
    return this.#value;
  }

  set value(value: string) {
    this.#value = value;
    this.update();
  }

  get category() {
    return this.#category;
  }

  set category(category: Category) {
    this.#category = category;
    this.update();
  }

  override toString() {
    return `${categoryIcon[this.#category]} ${this.#name}:${this.#value}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      value: this.#value,
      category: this.#category,
    };
  }
}
