const bcrypt = require("bcrypt");
const { prisma } = require("../database/client");
const CustomError = require("../utils/customError");
const ERROR_CODE = require("../constants/errorCode");

exports.getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new CustomError(404, ERROR_CODE.USER_NOT_FOUND, "User not found");
  }
  return user;
};

exports.updateUserProfile = async (userId, updateData) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError(404, ERROR_CODE.USER_NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, userName: true, updatedAt: true },
  });
  return updatedUser;
};

exports.updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError(400, ERROR_CODE.USER_NOT_FOUND, "User not found");
  }

  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    user.passwordHash
  );
  if (!isOldPasswordValid) {
    throw new CustomError(
      401,
      ERROR_CODE.USER_PASSWORD_NOT_MATCH,
      "Invalid old password"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword },
  });
};

exports.validateUserCredentials = async (usernameOrEmail, password) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { userName: usernameOrEmail }],
    },
  });

  if (!user) {
    throw new CustomError(404, ERROR_CODE.USER_NOT_FOUND, "User not found");
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new CustomError(
      401,
      ERROR_CODE.CREDENTIALS_INVALID,
      "Invalid Password"
    );
  }

  return user;
};
