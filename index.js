const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const response = openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Corrija: Olá, meu neme é João.",
  max_tokens: 50,
  temperature: 0,
}).then((response) => {
    console.log(response.data.choices[0].text);
});

