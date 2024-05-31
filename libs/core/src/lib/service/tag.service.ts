import { TagEntity } from '../entity/index.ts';

// IDEA: this class can be an entity
export class TagManager {
  private _availableTags: TagEntity[];

  constructor(tags: TagEntity[]) {
    this._availableTags = tags;
  }

  get availableTags() {
    return this._availableTags;
  }

  getTag(index: number) {
    return this._availableTags[index];
  }
  
  addTag(tag: TagEntity) {
    this._availableTags.push(tag);
  }

  removeTag(index: number) {
    this._availableTags.splice(index, 1);
  }
}

// IDEA: or maybe this class is not a service
export class InputTagManager extends TagManager {
  constructor() {
    super([
      new TagEntity("Moderation", "safe", "user input does not contain hate speech", "Perfect"),
      new TagEntity("Moderation", "unsafe", "user input contains hate speech", "Bad"),
      new TagEntity("Language", "translation requested", "user input is in english, but contains request for translation", "Neutral"),
      new TagEntity("Language", "non english", "user input is not in english", "Bad"),
      new TagEntity("Language", "english", "User input is in english", "Perfect"),
    ]);
  }
}

export class PromptTagManager extends TagManager {
  constructor() {
    super([
      new TagEntity("Learning", "zero shot", "no examples provided in prompt", "Neutral"),
      new TagEntity("Learning", "one shot", "1 example provided in prompt", "Neutral"),
      new TagEntity("Learning", "few shot", "some examples provided in prompt", "Neutral"),
      new TagEntity("Format location", "system", "the format for output is contained in system prompt", "Neutral"),
      new TagEntity("Format location", "user", "the format for output is contained in user prompt", "Neutral"),
      new TagEntity("Chat History", "present", "previous messages are present in the prompt", "Neutral"),
      new TagEntity("Chat History", "absent", "previous messages are not present in the prompt", "Neutral"),
    ]);
  }
}

export class ResultTagManager extends TagManager {
  constructor() {
    super([
      new TagEntity("Format", "exact", "", "Perfect"),
      new TagEntity("Format", "parsable", "", "Perfect"),
      new TagEntity("Format", "semi parsable", "", "Neutral"),
      new TagEntity("Format", "unparsable", "", "Bad"),
      new TagEntity("Quality", "good", "", "Perfect"),
      new TagEntity("Quality", "generic", "", "Ok"),
      new TagEntity("Length", "truncated", "", "Bad"),
      new TagEntity("Length", "short", "", "Neutral"),
      new TagEntity("Length", "exact", "", "Perfect"),
      new TagEntity("Length", "long", "", "Neutral"),
      new TagEntity("Moderation", "safe", "", "Perfect"),
      new TagEntity("Moderation", "unsafe", "", "Bad"),
      new TagEntity("Moderation", "flagged", "", "Bad"),
      new TagEntity("Language", "non english", "", "Neutral"),
    ]);
  }
}