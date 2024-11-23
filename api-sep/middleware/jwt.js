const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Neispravan Token",
        });
      }
      next();
    });
  } else {
    return res.status(403).json({ message: "Nije dostavljen auth token" });
  }
};

module.exports = { checkToken };
