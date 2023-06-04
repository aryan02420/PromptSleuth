import { Entity } from "./entity.ts";
import { Param } from "./param.ts";

export class Model extends Entity {
  private _name: string;
  private _params: Param[];
  private _paramMap: Map<string, Param>;

  constructor(name: string, params: Param[]) {
    super();
    this._name = name;
    this._params = params;
    this._paramMap = new Map(params.map((param) => [param.name, param]));
  }
  
  get name() {
    return this._name;
  }

  get params() {
    return this._params;
  }

  getParam(name: string) {
    return this._paramMap.get(name);
  }

  setParam(name: string, value: unknown) {
    if (!this._paramMap.has(name)) {
      throw new Error(`Param ${name} does not exist`);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._paramMap.get(name)!.value = value;
    this.update();
  }

  override toString() {
    return `${this._name}:${this._params.map((param) => param.toString()).join("/")}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this._name,
      params: this._params.map((param) => param.toJSON()),
    };
  }
}
