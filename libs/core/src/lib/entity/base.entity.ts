export class BaseEntity {
  private _id: string;
  private _type: string;
  private _createdAt: string;
  private _updatedAt: string;

  constructor() {
    this._createdAt = new Date().toISOString();
    this._id = crypto.randomUUID();
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

  static fromJSON(json: ReturnType<BaseEntity["toJSON"]>) {
    const entity = new BaseEntity();
    entity._type = json.__typename;
    entity._createdAt = json.createdAt;
    entity._updatedAt = json.updatedAt;
    return entity;
  }

  copy() {
    const entity = new BaseEntity();
    entity._type = this._type;
    entity._createdAt = this._createdAt;
    entity._updatedAt = this._updatedAt;
    return entity;
  }

  clone() {
    const entity = new BaseEntity();
    entity._type = this._type;
    entity._createdAt = this._createdAt;
    entity._updatedAt = this._updatedAt;
    return entity;
  }

  equals(entity: BaseEntity) {
    return this._id === entity.id;
  }

  compare(entity: BaseEntity) {
    return this._id.localeCompare(entity.id);
  }

  static isEntity(entity: unknown): entity is BaseEntity {
    return entity instanceof BaseEntity;
  }
}
