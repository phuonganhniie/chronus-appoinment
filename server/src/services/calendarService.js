const { prisma } = require("../database/client");
const ERROR_CODE = require("../constants/errorCode");

// Controller methods for CRUD operations
exports.createCalendar = async (userId, settings) => {
  // Create a new calendar
  const calendar = await prisma.calendar.create({
    data: {
      userId,
      settings,
    },
  });

  return calendar;
};

exports.getCalendar = async (userId) => {
  // Find the calendar for the specified user
  const calendar = await prisma.calendar.findUnique({
    where: {
      userId,
    },
  });
  if (!calendar) {
    throw {
      status: 404,
      errorCode: ERROR_CODE.CALENDAR_NOT_FOUND,
      message: "Calendar not found",
    };
  }

  return calendar;
};

// exports.updateCalendar = async (userId, eventTypes) => {
//   // Find and update the calendar for the specified user
//   const calendar = await prisma.calendar.update({
//     where: {
//       userId,
//     },
//     data: {
//       eventTypes,
//     },
//   });

//   if (!calendar) {
//     throw {
//       status: 404,
//       errorCode: ERROR_CODE.CALENDAR_NOT_FOUND,
//       message: "Calendar not found",
//     };
//   }

//   return calendar;
// };

exports.updateCalendar = async (userId, totalEventTypes) => {
  // Find and update the calendar for the specified user
  const calendar = await prisma.calendar.findUnique({
    where: {
      userId,
    },
  });
  console.log("check the calendar", calendar);

  if (!calendar) {
    throw {
      status: 404,
      errorCode: ERROR_CODE.CALENDAR_NOT_FOUND,
      message: "Calendar not found",
    };
  }

  const updateSettings = {
    ...calendar.settings,
    totalEventTypes: totalEventTypes,
  };

  console.log("check the updateSettings", updateSettings);

  const updatedCalendar = await prisma.calendar.update({
    where: {
      userId,
    },
    data: {
      settings: updateSettings,
    },
  });
  console.log("check the updated calendar", updatedCalendar);

  return updatedCalendar;
};
