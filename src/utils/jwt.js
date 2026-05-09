const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 */
const generateToken = (
  payload
) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

/**
 * Verify JWT token
 */
const verifyToken = (
  token
) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

module.exports = {
  generateToken,
  verifyToken,
};