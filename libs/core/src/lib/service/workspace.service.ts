import { Prompt } from './prompt.service';
import { PromptTagManager } from './tag.service';

export class Workspace {
  public prompts: Prompt[] = [];
  public promptTagManager: PromptTagManager;

  constructor() {
    this.prompts.push(new Prompt());
    this.promptTagManager = new PromptTagManager();
  }

  addPrompt() {
    this.prompts.push(new Prompt());
  }

  removePrompt(index: number) {
    this.prompts.splice(index, 1);
  }
}