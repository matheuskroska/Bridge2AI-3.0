const authenticate = require("../middleware/authenticate");
const express = require("express");
const openai = require("../config");
const router = express.Router();

router.post("/image", authenticate, async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: req.query.n || 1,
      size: req.query.size || "256x256",
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
