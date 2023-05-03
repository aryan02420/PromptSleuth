/** @type {import('#types.ts').Config} */
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
  validator: (rawCompletion, metadata) => {
    if (/Hello \w+!/.test(rawCompletion))
      return "LooksGood";
    // TODO: need to pass in the metadata to the validator
    if (metadata.moderated)
      return "Moderated";
    return "BadFormat";
  },
  parser: (tokenStream) => {
    let parsed = "";
    while (true) {
      const { done, value: token } = tokenStream.next();
      if (done) break;
      parsed += token;
    }
    return parsed;
  },
};
