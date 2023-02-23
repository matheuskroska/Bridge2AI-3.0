const express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const { OpenAIApi, Configuration } = require("openai");
const dotenv = require("dotenv").config();
const generateToken = require("../utils/generateToken");
const app = express();
const port = 3000;
const auth_username = process.env.USER;
const auth_pass = process.env.PASSWORD;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const router = express.Router();

router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  // Verificar credenciais aqui
  if (username === auth_username && password === auth_pass) {
    const payload = { username };
    const token = generateToken(payload);

    res.json({ message: "Autenticação realizada com sucesso", token });
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

module.exports = router;
