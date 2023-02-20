const express = require("express");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

// Create an OpenAI API client with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Enable CORS for cross-origin requests

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// Define a route to handle requests to your API
app.post("/completion", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    // Call the OpenAI API to generate text completion
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: req.query.max_tokens || 50,
      temperature: req.query.temperature || 0,
    });

    // Return the generated text to the client
    res.send(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text completion");
  }
});

// Start the web server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
