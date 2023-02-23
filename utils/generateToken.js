const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, "secret_key", { expiresIn: "1h" });
};

module.exports = generateToken;
