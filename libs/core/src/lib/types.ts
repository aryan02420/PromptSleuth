// for reference only

export interface Entity {
  _id: string;
  _type: string;
  toString(): string;
}

export interface Param<TValue> extends Entity {
  _type: 'param';
  key: string;
  value: TValue;
}

export interface Model<TParams> extends Entity {
  _type: 'model';
  name: string;
  params: Param<TParams>[];
}

export interface Message<> extends Entity {
  _type: 'message';
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Prompt<TModel> extends Entity {
  _type: 'prompt';
  name: string;
  model: Model<TModel>;
  messages: Message[];
}

export interface Input<> extends Entity {
  _type: 'input';
  value: string[];
}

export interface Completion<TModel, TMetadata> extends Entity {
  _type: 'completion';
  prompt: Prompt<TModel>;
  input: Input;
  result: string;
  metadata: TMetadata;
}

export interface Result<TModel, TMetadata> {
  _type: 'result';
  Completion: Completion<TModel, TMetadata>;
}
