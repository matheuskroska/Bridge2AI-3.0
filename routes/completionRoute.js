const authenticate = require("../middleware/authenticate");
const openai = require("../config").openai;
const router = require("../config").router;

router.post("/completion", authenticate, async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: req.query.max_tokens || 50,
      temperature: req.query.temperature || 0,
    });

    res.send(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text completion");
  }
});

module.exports = router;
