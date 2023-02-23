const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const port = 3000;

app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = { openai, router, app, port };
