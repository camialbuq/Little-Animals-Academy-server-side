const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    res.status(400).json({ message: "Unauthorized no token created" });
    return;
  }

  const token = bearerToken.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    console.log(token, "backend");
    if (error) return res.status(401).json({ message: "Unauthorized" });
    req.user = { ...decoded, isAuthenticated: true };
    next();
  });
}

module.exports = isAuthenticated;
