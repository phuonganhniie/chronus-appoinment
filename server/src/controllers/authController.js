const ERROR_CODE = require("../constants/errorCode");
const CustomError = require("../utils/customError");
const { logger } = require("../utils/logger");
const bcrypt = require("bcrypt");

const tokenService = require("../services/tokenService");
const userService = require("../services/userService");

exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      throw new CustomError(
        400,
        ERROR_CODE.USER_LOGIN_INPUT_INVALID,
        "Username / email and password are required"
      );
    }

    const user = await userService.validateUserCredentials(
      usernameOrEmail,
      password
    );

    const accessToken = await tokenService.generateAccessToken(user.id);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    await tokenService.storedRefreshToken(user.id, refreshToken);

    res.sendData("User login successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    logger.errorf("Error in user login: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new CustomError(
      400,
      ERROR_CODE.TOKEN_REQUIRED,
      "Refresh token is required"
    );
  }

  try {
    const { userId } = await tokenService.verifyRefreshToken(refreshToken);

    const newAccessToken = await tokenService.generateAccessToken(userId);

    res.sendData("Refreshing token successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.errorf("Error refreshing token: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.invalidateToken = async (req, res, next) => {
  const token = req.body.refreshToken;
  try {
    await tokenService.invalidateToken(token);
    res.sendData("Revoke token successfully");
  } catch (error) {
    logger.errorf("Error invalidating token: %v", error);
    res.sendError(error.status, error.errorCode, error.message);
  }
};
