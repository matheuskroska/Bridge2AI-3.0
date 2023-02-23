const { OpenAIApi, Configuration } = require("openai");
const authenticate = require("../middleware/authenticate");
const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/image", authenticate, async (req, res) => {
  const prompt = req.body.prompt;
  try {
    // Call the OpenAI API to generate an image
    const response = await openai.createImage({
      prompt: prompt,
      n: req.query.n || 1,
      size: req.query.size || "256x256",
    });

    // Return the generated image to the client
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
