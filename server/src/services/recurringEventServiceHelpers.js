const ERROR_CODE = require("../constants/errorCode");
const EVENT_ENUM = require("../constants/eventEnum");
const CustomError = require("../utils/customError");

exports.getNextOccurrence = (currentDate, pattern) => {
  const nextDate = new Date(currentDate);

  switch (pattern) {
    case EVENT_ENUM.RECURRING_PATTERN.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case EVENT_ENUM.RECURRING_PATTERN.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case EVENT_ENUM.RECURRING_PATTERN.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case EVENT_ENUM.RECURRING_PATTERN.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;

    default:
      throw new CustomError(
        400,
        ERROR_CODE.EVENT_RECURRING_PATTERN_INVALID,
        `Unsupported recurrence pattern: ${pattern}`
      );
  }
  return nextDate;
};
