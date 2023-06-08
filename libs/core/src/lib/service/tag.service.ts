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
      new TagEntity("Moderation", "safe", "Perfect"),
      new TagEntity("Moderation", "unsafe", "Bad"),
      new TagEntity("Language", "translation requested", "Neutral"),
      new TagEntity("Language", "non english", "Neutral"),
    ]);
  }
}

export class PromptTagManager extends TagManager {
  constructor() {
    super([
      new TagEntity("Learning", "zero shot", "Neutral"),
      new TagEntity("Learning", "one shot", "Neutral"),
      new TagEntity("Learning", "few shot", "Neutral"),
      new TagEntity("Format location", "system", "Neutral"),
      new TagEntity("Format location", "user", "Neutral"),
      new TagEntity("Chat History", "present", "Neutral"),
      new TagEntity("Chat History", "absent", "Neutral"),
    ]);
  }
}

export class ResultTagManager extends TagManager {
  constructor() {
    super([
      new TagEntity("Format", "exact", "Perfect"),
      new TagEntity("Format", "parsable", "Perfect"),
      new TagEntity("Format", "semi parsable", "Neutral"),
      new TagEntity("Format", "unparsable", "Bad"),
      new TagEntity("Quality", "good", "Perfect"),
      new TagEntity("Quality", "generic", "Ok"),
      new TagEntity("Length", "truncated", "Bad"),
      new TagEntity("Length", "short", "Neutral"),
      new TagEntity("Length", "exact", "Perfect"),
      new TagEntity("Length", "long", "Neutral"),
      new TagEntity("Moderation", "safe", "Perfect"),
      new TagEntity("Moderation", "unsafe", "Bad"),
      new TagEntity("Moderation", "flagged", "Bad"),
      new TagEntity("Language", "non english", "Neutral"),
    ]);
  }
}