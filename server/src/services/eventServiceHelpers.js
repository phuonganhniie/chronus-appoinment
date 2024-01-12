const EVENT_ENUM = require("../constants/eventEnum");
const moment = require("moment");

exports.calculateReminderTime = (
  eventStartTime,
  reminderOption,
  customReminderTime
) => {
  let reminderTime;

  if (reminderOption !== undefined && reminderOption !== null) {
    switch (reminderOption) {
      case EVENT_ENUM.REMINDER.AT_EVENT_TIME:
        reminderTime = new Date(eventStartTime);
        break;

      case EVENT_ENUM.REMINDER["5_MIN_BEFORE"]:
        reminderTime = moment(eventStartTime).subtract(5, "minutes").toDate();
        break;

      case EVENT_ENUM.REMINDER["30_MIN_BEFORE"]:
        reminderTime = moment(eventStartTime).subtract(30, "minutes").toDate();
        break;

      case EVENT_ENUM.REMINDER["1_HOUR_BEFORE"]:
        reminderTime = moment(eventStartTime).subtract(1, "hours").toDate();
        break;

      case EVENT_ENUM.REMINDER["1_DAY_BEFORE"]:
        reminderTime = moment(eventStartTime).subtract(1, "days").toDate();
        break;

      case EVENT_ENUM.REMINDER.CUSTOM:
        if (
          customReminderTime &&
          moment(customReminderTime, moment.ISO_8601, true).isValid()
        ) {
          reminderTime = new Date(customReminderTime);
        } else {
          throw new CustomError(
            400,
            ERROR_CODE.EVENT_REMINDER_TIME_INVALID,
            "Invalid custom reminder time."
          );
        }
        break;

      default:
        throw new CustomError(
          400,
          ERROR_CODE.EVENT_REMINDER_OPTION_INVALID,
          "Invalid reminder option."
        );
    }
  }

  return reminderTime;
};

exports.filterUpdateData = (newEventData) => {
  const { invitees, isRecurring, recurringDetails, ...updateData } =
    newEventData;
  return updateData;
};

exports.validateTime = (updateData) => {
  if (
    updateData.startTime &&
    updateData.endTime &&
    updateData.startTime >= updateData.endTime
  ) {
    throw new CustomError(
      400,
      ERROR_CODE.EVENT_TIME_INVALID,
      "Start time must be before end time."
    );
  }
  if (updateData.startTime) {
    updateData.startTime = new Date(updateData.startTime);
  }
  if (updateData.endTime) {
    updateData.endTime = new Date(updateData.endTime);
  }
};

exports.calculateTimeframeDates = (timeframe, year, month) => {
  const now = moment();
  year ??= now.year();
  month ??= now.month() + 1;

  let startDate, endDate;

  switch (timeframe) {
    case "day":
      startDate = now.clone().startOf("day");
      endDate = now.clone().endOf("day");
      break;

    case "week":
      let referenceDate = moment([year, month - 1]);

      if (
        now.month() === referenceDate.month() &&
        now.year() === referenceDate.year()
      ) {
        startDate = now.clone().startOf("isoWeek");
        endDate = now.clone().endOf("isoWeek");
      } else {
        // If the current date is outside the provided month and year, use the first day of the provided month to determine the week
        startDate = referenceDate.clone().startOf("isoWeek");
        endDate = startDate.clone().endOf("isoWeek");
      }
      break;

    case "month":
      startDate = moment([year, month - 1]).startOf("month");
      endDate = moment([year, month - 1]).endOf("month");
      break;

    default:
      throw new CustomError(
        400,
        ERROR_CODE.EVENT_INVALID_TIMEFRAME,
        "Invalid timeframe"
      );
  }

  return { startDate, endDate };
};

exports.validateEventInput = (eventData) => {
  let { title, startTime, endTime, eventType } = eventData;

  if (!title || !eventType || !startTime || !endTime) {
    throw new CustomError(
      400,
      ERROR_CODE.EVENT_INPUT_REQUIRED,
      "Missing required fields"
    );
  }

  if (
    !moment(startTime, moment.ISO_8601, true).isValid() ||
    !moment(endTime, moment.ISO_8601, true).isValid()
  ) {
    throw new CustomError(
      400,
      ERROR_CODE.EVENT_INPUT_INVALID,
      "Invalid date format. Use ISO 8601 format."
    );
  }
};
