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
  ],
  repeats: 2,
  validator: (result, actions) => {
    if (/Hello \w+!/.test(result.output.text))
      return actions.LooksGood;
    return actions.BadFormat;
  }
};
