const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const ERROR_CODE = require("../constants/errorCode");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendError(
      401,
      ERROR_CODE.TOKEN_REQUIRED,
      "Authorization header is required"
    );
  }

  const tokenParts = authHeader.split(" "); // Bearer Token
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    return res.sendError(401, ERROR_CODE.TOKEN_INVALID, "Invalid token format");
  }
  const token = tokenParts[1];

  try {
    const user = jwt.verify(token, config.jwt_secret);
    req.user = user;
    next();
  } catch (error) {
    return res.sendError(403, ERROR_CODE.TOKEN_INVALID, "Invalid token");
  }
};

module.exports = authenticateToken;
