const express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const { OpenAIApi, Configuration } = require("openai");
const dotenv = require("dotenv").config();
const authenticate = require("../middleware/authenticate");
const generateToken = require("../utils/generateToken");
const validateImage = require("../utils/validateImage");
const validateMask = require("../utils/validateMask");
const app = express();
const port = 3000;
const auth_username = process.env.USER;
const auth_pass = process.env.PASSWORD;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const router = express.Router();

// Create an OpenAI API client with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/image-edit", authenticate, async (req, res, next) => {
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

module.exports = router;
