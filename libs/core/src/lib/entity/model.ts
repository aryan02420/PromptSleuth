import { Entity } from "./entity.ts";
import { NumberParam, Param } from "./param.ts";

export class Model extends Entity {
  #name: string;
  #params: Param[];
  #paramMap: Map<string, Param>;

  constructor(name: string, params: Param[]) {
    super();
    this.#name = name;
    this.#params = params;
    this.#paramMap = new Map(params.map((param) => [param.name, param]));
  }
  
  get name() {
    return this.#name;
  }

  get params() {
    return this.#params;
  }

  getParam(name: string) {
    return this.#paramMap.get(name);
  }

  setParam(name: string, value: unknown) {
    if (!this.#paramMap.has(name)) {
      throw new Error(`Param ${name} does not exist`);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#paramMap.get(name)!.value = value;
    this.update();
  }

  override toString() {
    return `${this.#name}:${this.#params.map((param) => param.toString()).join("/")}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      params: this.#params.map((param) => param.toJSON()),
    };
  }
}

export class OpenAIChatGptThreeDotFiveTurboModel extends Model {
  constructor() {
    super("openai-chat-gpt-3.5-turbo", [
      new NumberParam("temperature", 0.7, 0, 1),
      new NumberParam("max_tokens", 150, 1, 2048),
      new NumberParam("top_p", 1, 0, 1),
      new NumberParam("frequency_penalty", 0.5, 0, 2),
      new NumberParam("presence_penalty", 0.5, 0, 2),
    ]);
  }
}

export class OpenAIChatGptFourModel extends Model {
  constructor() {
    super("openai-chat-gpt-4", [
      new NumberParam("temperature", 0.7, 0, 1),
      new NumberParam("max_tokens", 150, 1, 2048),
      new NumberParam("top_p", 1, 0, 1),
      new NumberParam("frequency_penalty", 0.5, 0, 2),
      new NumberParam("presence_penalty", 0.5, 0, 2),
    ]);
  }
}