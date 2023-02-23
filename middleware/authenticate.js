require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined") {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const bearerToken = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(bearerToken, secret);
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authenticate;
