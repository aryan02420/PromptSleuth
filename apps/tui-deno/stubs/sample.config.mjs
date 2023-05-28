const genericValidator = (rawCompletion, metadata, actions) => {
  if (/Hello \w+!/.test(rawCompletion)) {
    return actions.LooksGood;
  }
  // TODO: need to pass in the metadata to the validator
  if (metadata.moderated) {
    return actions.Moderated;
  }
  return actions.BadFormat;
};

const genericParser = (tokenStream) => {
  let parsed = "";
  while (true) {
    const { done, value: token } = tokenStream.next();
    if (done) break;
    parsed += token;
  }
  return parsed;
};

/** @type {import('tui-deno/types.ts').Config} */
export default {
  name: "Sample Config File",
  prompts: [
    {
      messages: [
        {
          role: "user",
          content: 'echo "Hello how are you?"',
        },
        {
          role: "assistant",
          content: "Hello how are you?",
        },
        {
          role: "user",
          content: 'echo "Hello %s!"',
        },
      ],
      params: {
        maxTokens: 100,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      validator: genericValidator,
      parser: genericParser,
    },
    {
      messages: [
        {
          role: "user",
          content: "Say Hello %s!",
        },
      ],
      params: {
        maxTokens: 100,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      validator: genericValidator,
      parser: genericParser,
    },
  ],
  inputs: [
    {
      fields: ["World"],
    },
    {
      fields: ["Universe"],
    },
    {
      fields: ["I am sorry, as an AI language model, I don't have feelings."],
    },
  ],
  repeats: 1,
};
