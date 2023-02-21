const express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

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

app.post("/image", async (req, res) => {
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

app.post("/image-edit", async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error parsing form data");
    }

    const imageFile = files.image;
    const maskFile = files.mask;
    const prompt = fields.prompt;

    try {
      if (!imageFile) {
        throw new Error("Image file not provided");
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        throw new Error("Image file too large");
      }

      const imageBuffer = await sharp(imageFile.path).toBuffer();
      const image = await sharp(imageBuffer);
      const mask = maskFile ? await sharp(maskFile.path) : null;

      const { width, height } = await image.metadata();
      if (width !== height) {
        throw new Error("Image must be square");
      }

      if (mask) {
        const { width: maskWidth, height: maskHeight } = await mask.metadata();
        if (maskWidth !== width || maskHeight !== height) {
          throw new Error("Mask must have the same dimensions as image");
        }
      }

      // Call the OpenAI API to edit an image
      const response = await openai.createImageEdit(
        fs.createReadStream(imageFile.path),
        maskFile
          ? fs.createReadStream(maskFile.path)
          : fs.createReadStream(imageFile.path),
        prompt,
        req.query.n || 2,
        req.query.size || `${width}x${height}`
      );

      // Return the edited image to the client
      res.contentType("image/png");
      res.send(Buffer.from(response.data, "binary"));

      // Remove temporary files created by formidable
      fs.unlinkSync(imageFile.path);
      if (maskFile) {
        fs.unlinkSync(maskFile.path);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error editing image");

      // Remove temporary files created by formidable
      fs.unlinkSync(imageFile.path);
      if (maskFile) {
        fs.unlinkSync(maskFile.path);
      }
    }
  });
});

// Start the web server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
