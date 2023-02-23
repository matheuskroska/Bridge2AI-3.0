const secret = "secret_key";
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined") {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const bearerToken = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(bearerToken, secret);
    // Add the decoded token to the request object for use in the next middleware function or endpoint
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authenticate;
