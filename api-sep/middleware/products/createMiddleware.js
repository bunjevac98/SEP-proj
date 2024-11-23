const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

/**
 * Checking the incoming data  for the /get-roles/:pageNumber/:limit/:searchTerm
 * @returns
 */

const checkRole = (requiredRole) => (req, res, next) => {
  // Get the token from headers
  let token = req.headers["x-access-token"] || req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Extract the token
    console.log("USAO ZA PROVERU TOKENA I ROLE", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Neispravan Token" });
      }
      // Check if the user's role matches the required role
      console.log("decoded.role", decoded.role);
      console.log("requiredRole.role", requiredRole);
      if (decoded.role && decoded.role === requiredRole) {
        next(); // User has the required role, proceed to the next middleware
      } else {
        return res.status(403).json({ message: "Forbiden" });
      }
    });
  } else {
    return res.status(403).json({ message: "Nije dostavljen auth token" });
  }
};

module.exports = { checkRole };
