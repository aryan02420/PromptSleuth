import { ObjectId } from "bson";

export class Entity {
  private _id: string;
  private _type: string;
  private _createdAt: string;
  private _updatedAt: string;

  constructor() {
    this._createdAt = new Date().toISOString();
    this._id = new ObjectId().toHexString();
    this._type = this.constructor.name;
    this._updatedAt = this._createdAt;
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  protected update() {
    this._updatedAt = new Date().toISOString();
  }

  toString(): string {
    return `${this._type}:${this._id}`;
  }

  toJSON() {
    return {
      _id: this._id,
      __typename: this._type,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
