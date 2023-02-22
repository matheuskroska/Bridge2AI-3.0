const express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const sharp = require("sharp");
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

// Define uma rota de API para processar solicitações POST para edição de imagens
app.post("/image-edit", async (req, res, next) => {
  // Cria um objeto 'formidable' para analisar o formulário enviado pelo cliente
  const form = formidable({ multiples: false });

  // Analisa a solicitação HTTP e extrai os dados do formulário
  form.parse(req, async (err, fields, files) => {
    // Verifica se ocorreu um erro ao analisar o formulário
    if (err) {
      // Repassa o erro para o próximo manipulador de erro
      next(err);
      return;
    }

    // Chama a função 'validateImage' para verificar se o arquivo de imagem enviado é válido
    const imageError = await validateImage(files.inputImage);
    // Chama a função 'validateMask' para verificar se o arquivo de máscara de imagem (se fornecido) é válido
    const maskError = await validateMask(files.mask, files.inputImage);

    // Verifica se houve um erro na validação do arquivo de imagem
    if (imageError) {
      // Envia uma resposta de erro ao cliente com um código de status 400 (Solicitação incorreta)
      res.status(400).send(imageError);
      return;
    }

    // Verifica se houve um erro na validação do arquivo de máscara de imagem (se fornecido)
    if (maskError) {
      // Envia uma resposta de erro ao cliente com um código de status 400 (Solicitação incorreta)
      res.status(400).send(maskError);
      return;
    }

    // Chama a função 'createImageEdit' do módulo 'openai' para gerar uma imagem editada com base nos dados fornecidos pelo cliente
    const response = await openai.createImageEdit(
      fs.createReadStream(files.inputImage.filepath),
      fs.createReadStream(files.mask.filepath),
      fields.prompt,
      fields.n || 1,
      fields.size || "256x256"
    );

    // Envia a imagem editada como resposta ao cliente
    res.send(response.data);
  });
});

// Start the web server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const validateImage = (image) => {
  if (!image) {
    return "Image is required";
  }

  // Check if the file is a PNG
  if (!image.mimetype || image.mimetype !== "image/png") {
    return "Image must be a PNG file";
  }

  // Check the file size
  if (image.size > 4000000) {
    return "Image must be less than 4MB";
  }

  const img = sharp(image.filepath);
  return img.metadata().then((metadata) => {
    if (metadata.width !== metadata.height) {
      return "Image must be square";
    }
    return null;
  });
};

const validateMask = async (mask, image) => {
  if (!mask) {
    if (image.filepath) {
      const img = sharp(image.filepath);
      return img.metadata().then((metadata) => {
        if (metadata.format === "png" && metadata.alpha === false) {
          return "If mask is not provided, image must have transparency, which will be used as the mask";
        }
        return null;
      });
    } else {
      return "Mask is required";
    }
  }

  // Check if the file is a PNG
  if (!mask.mimetype || mask.mimetype !== "image/png") {
    return "Mask must be a PNG file";
  }

  // Check the file size
  if (mask.size > 4000000) {
    return "Mask must be less than 4MB";
  }

  // Check if the mask has the same dimensions as the image
  const img = sharp(image.filepath);
  const maskImg = sharp(mask.filepath);
  return Promise.all([img.metadata(), maskImg.metadata()]).then(
    ([imgMetadata, maskMetadata]) => {
      if (
        imgMetadata.width !== maskMetadata.width ||
        imgMetadata.height !== maskMetadata.height
      ) {
        return "Mask must have the same dimensions as the image";
      }
      return null;
    }
  );
};
