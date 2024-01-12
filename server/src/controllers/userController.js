const ERROR_CODE = require("../constants/errorCode");
const userService = require("../services/userService");
const CustomError = require("../utils/customError");
const { logger } = require("../utils/logger");

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await userService.getUserProfile(userId);

    res.sendData("Get user profile successfully", user);
  } catch (error) {
    logger.errorf("Get user profile error: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const updateData = {};
    if (userName) {
      updateData.userName = userName;
    }

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    res.sendData("Update user profile successfully", updatedUser);
  } catch (error) {
    logger.errorf("Update user profile error: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new CustomError(
        400,
        ERROR_CODE.USER_UPDATE_INPUT_INVALID,
        "Old password and new password are required"
      );
    }

    await userService.updatePassword(userId, oldPassword, newPassword);

    res.sendData("Update password successfully");
  } catch (error) {
    logger.errorf("Update user password error: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};
