const generateToken = require("../utils/generateToken");
const auth_username = process.env.USER;
const auth_pass = process.env.PASSWORD;
const router = require("../config").router;

router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  if (username === auth_username && password === auth_pass) {
    const payload = { username };
    const token = generateToken(payload);

    res.json({ message: "Autenticação realizada com sucesso", token });
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

module.exports = router;
