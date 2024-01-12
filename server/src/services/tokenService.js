const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const { prisma } = require("../database/client");
const CustomError = require("../utils/customError");
const ERROR_CODE = require("../constants/errorCode");
const moment = require("moment");

exports.generateAccessToken = async (userId) => {
  const accessToken = jwt.sign({ userId }, config.jwt_secret, {
    expiresIn: config.expires_access_token,
  });
  return accessToken;
};

exports.generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, config.refresh_token_secret, {
    expiresIn: config.expires_refresh_token,
  });
  return refreshToken;
};

exports.storedRefreshToken = async (userId, refreshToken) => {
  let expiresDate = moment().add(7, "days").toDate();
  await prisma.session.create({
    data: {
      userId: userId,
      refreshToken: refreshToken,
      expiresAt: expiresDate,
    },
  });
};

exports.verifyRefreshToken = async (refreshToken) => {
  const session = await prisma.session.findFirst({
    where: { refreshToken: refreshToken },
  });

  if (!session) {
    throw new CustomError(
      400,
      ERROR_CODE.TOKEN_INVALID,
      "Invalid refresh token"
    );
  }

  return jwt.verify(refreshToken, config.refresh_token_secret);
};

exports.invalidateToken = async (refreshToken) => {
  const session = await prisma.session.findFirst({
    where: { refreshToken: refreshToken },
  });

  if (!session) {
    throw new CustomError(
      400,
      ERROR_CODE.TOKEN_NOTFOUND,
      "Refresh Token not found"
    );
  }

  await prisma.session.delete({
    where: { id: session.id, refreshToken: refreshToken },
  });
};
