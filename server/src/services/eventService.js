const ERROR_CODE = require("../constants/errorCode");
const { prisma } = require("../database/client");
const moment = require("moment");
const CustomError = require("../utils/customError");
const {
  calculateTimeframeDates,
  filterUpdateData,
  validateTime,
  calculateReminderTime,
} = require("./eventServiceHelpers");
const recurringEventService = require("./recurringEventService");
const EVENT_ENUM = require("../constants/eventEnum");

// CREATE EVENT LOGIC
exports.createEvent = async (userId, eventData) => {
  let {
    calendarId,
    title,
    description,
    location,
    startTime,
    endTime,
    allDay,
    eventType,
    color,
    isRecurring,
    recurringDetails, // Details about the recurring event: pattern, endDate, numberOfOccurrences
  } = eventData;

  // retrieve user's calendar
  const calendar = calendarId
    ? await prisma.calendar.findUnique({
        where: { id: calendarId, userId: userId },
      })
    : await prisma.calendar.findFirst({ where: { userId: userId } });

  if (!calendar) {
    throw new CustomError(
      404,
      ERROR_CODE.CALENDAR_NOT_FOUND,
      "Calendar not found for the user"
    );
  }

  startTime = new Date(startTime);
  endTime = new Date(endTime);

  console.log("check the start time", startTime);

  // handle all day events
  if (allDay) {
    startTime = new Date(startTime.setHours(0, 0, 0, 0));
    endTime = new Date(endTime.setHours(23, 59, 59, 999));
  } else if (startTime >= endTime) {
    throw new CustomError(
      400,
      ERROR_CODE.EVENT_TIME_INVALID,
      "Start time must be before end time."
    );
  }

  const mainEvent = await prisma.event.create({
    data: {
      calendarId: calendar.id,
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      allDay: allDay,
      eventType,
      color,
    },
  });

  // Handle recurring events
  isRecurring = isRecurring !== undefined ? isRecurring : false;
  recurringDetails = recurringDetails !== undefined ? recurringDetails : null;
  if (isRecurring && recurringDetails) {
    await recurringEventService.createRecurringEvent(
      mainEvent,
      recurringDetails
    );
  }
  return mainEvent;
};

// GET EVENT BY ID LOGIC
exports.getEventById = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      calendar: true,
      eventAttendees: true,
      notifications: true,
      recurring: true,
    },
  });

  if (!event) {
    throw new CustomError(404, ERROR_CODE.EVENT_NOT_FOUND, "Event not found");
  }

  const isOwner = event.calendar.userId === userId;
  const isAttendee = event.eventAttendees.some(
    (attendee) => attendee.attendeeId === userId
  );
  if (!isOwner && !isAttendee) {
    throw new CustomError(
      403,
      ERROR_CODE.EVENT_UNAUTHORIZE,
      "Unauthorized access"
    );
  }

  const allEvents = [event, ...event.recurring];

  return allEvents;
};

// GET LIST EVENTS LOGIC
exports.listEvents = async (
  userId,
  timeframe,
  year,
  month,
  customStartTime,
  customEndTime
) => {
  let startDate, endDate;

  if (customStartTime && customEndTime) {
    startDate = moment(customStartTime);
    endDate = moment(customEndTime);
  } else if (timeframe) {
    const calculatedDates = calculateTimeframeDates(timeframe, year, month);
    startDate = calculatedDates.startDate;
    endDate = calculatedDates.endDate;
  } else {
    throw new CustomError(
      400,
      ERROR_CODE.EVENT_INPUT_INVALID,
      "Either timeframe or custom start and end times must be provided."
    );
  }

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { calendar: { userId } },
        { eventAttendees: { some: { attendeeId: userId } } },
      ],
      startTime: { gte: startDate.toDate() },
      endTime: { lte: endDate.toDate() },
    },
    include: { eventAttendees: true, notifications: true, recurring: true },
    orderBy: { startTime: "asc" },
  });

  return events.length > 0 ? events : [];
};

// UPDATE EVENT LOGIC
exports.updateEvent = async (eventId, newEventData, userId) => {
  // retrieve the existing event
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
    include: { calendar: true, eventAttendees: true },
  });
  if (!existingEvent) {
    throw new CustomError(404, ERROR_CODE.EVENT_NOT_FOUND, "Event not found");
  }

  if (existingEvent.calendar.userId !== userId) {
    throw new CustomError(
      403,
      ERROR_CODE.EVENT_UNAUTHORIZE,
      "Unauthorized access"
    );
  }

  // prepare the updated data
  const updateData = filterUpdateData(newEventData);

  // validate start and end time
  validateTime(updateData);

  // update event
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: updateData,
  });

  // detect changes that require attendee notification
  // const shouldNotifyAttendees =
  //   updateData.startTime !== existingEvent.startTime ||
  //   updateData.endTime !== existingEvent.endTime;

  // if (shouldNotifyAttendees) {
  //   await notifyAttendeesOfUpdates(eventId, existingEvent.eventAttendees);
  // }

  // check for recurring event updates
  if ("isRecurring" in newEventData) {
    if (newEventData.isRecurring) {
      await recurringEventService.handleAddRecurringOption(
        eventId,
        newEventData.recurringDetails
      );
    } else {
      await recurringEventService.handleRemoveRecurringOption(eventId);
    }
  }

  // update reminders if necessary
  if (
    "reminderOption" in newEventData ||
    "customReminderTime" in newEventData
  ) {
    await updateEventReminder(eventId, newEventData, userId);
  }

  // update invitees if the list is provided
  if ("invitees" in newEventData) {
    await updateInvitees(eventId, newEventData.invitees, existingEvent);
  }

  return updatedEvent;
};

// DELETE EVENT LOGIC
exports.deleteEvent = async (eventId, userId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { calendar: true, recurring: true },
  });

  if (!event) {
    throw new CustomError(404, ERROR_CODE.EVENT_NOT_FOUND, "Event not found");
  }

  if (event.calendar.userId !== userId) {
    throw new CustomError(
      403,
      ERROR_CODE.EVENT_UNAUTHORIZE,
      "Unauthorized to delete this event"
    );
  }

  // await prisma.event.delete({ where: { id: eventId } });
  await prisma.event.deleteMany({
    where: {
      OR: [{ id: eventId }, { recurring: { some: { eventId: eventId } } }],
    },
  });
};

exports.processInvitees = async (newEvent, invitees) => {
  if (invitees && Array.isArray(invitees)) {
    for (const invitee of invitees) {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: invitee }, { userName: invitee }] },
      });

      if (!user) {
        logger.errorf("Invitee user not found: %v", invitee);
        continue;
      }

      // check if invitee has calendar
      let inviteeCalendar = await prisma.calendar.findFirst({
        where: { userId: user.id },
      });
      if (!inviteeCalendar) {
        continue;
      }

      // create EventAttendee and Notification for each invitee
      const eventAttendee = await prisma.eventAttendee.create({
        data: {
          eventId: newEvent.id,
          attendeeId: user.id,
          status: EVENT_ENUM.INVITATION_STATUS.INVITED,
        },
      });

      // create notification for invitation
      await prisma.notification.create({
        data: {
          eventId: newEvent.id,
          userId: user.id,
          eventAttendeeId: eventAttendee.id,
          type: EVENT_ENUM.EVENT_NOTIFY.INVITATION,
          sendAt: new Date(newEvent.startTime),
        },
      });
    }
  }
};

exports.setupEventReminder = async (
  newEvent,
  reminderOption,
  customReminderTime,
  userId
) => {
  const reminderTime = calculateReminderTime(
    newEvent.startTime,
    reminderOption,
    customReminderTime
  );

  if (reminderTime) {
    await prisma.notification.create({
      data: {
        eventId: newEvent.id,
        userId: userId,
        type: EVENT_ENUM.EVENT_NOTIFY.REMINDER,
        sendAt: reminderTime,
      },
    });
  }
};

const updateEventReminder = async (eventId, newEventData, userId) => {
  const reminderOption = newEventData.reminderOption;

  // handle no reminder case
  if (reminderOption === EVENT_ENUM.REMINDER.NONE) {
    await prisma.notification.deleteMany({
      where: { eventId: eventId, type: EVENT_ENUM.EVENT_NOTIFY.REMINDER },
    });
    return;
  }

  const reminderTime = calculateReminderTime(
    newEventData.startTime,
    reminderOption,
    newEventData.customReminderTime
  );

  // check if an existing reminder needs to be updated or a new one created
  const existingReminder = await prisma.notification.findFirst({
    where: { eventId: eventId, type: EVENT_ENUM.EVENT_NOTIFY.REMINDER },
  });

  if (existingReminder) {
    if (existingReminder.sendAt.getTime() !== reminderTime.getTime()) {
      await prisma.notification.update({
        where: { id: existingReminder.id },
        data: { sendAt: reminderTime, sent: false },
      });
    }
  } else {
    await prisma.notification.create({
      data: {
        eventId: eventId,
        userId: userId,
        type: EVENT_ENUM.EVENT_NOTIFY.REMINDER,
        sendAt: reminderTime,
      },
    });
  }
};

const updateInvitees = async (eventId, newInvitees, originalEventData) => {
  const existingInviteeEvents = await prisma.eventAttendee.findMany({
    where: { eventId: eventId },
    include: {
      attendee: true,
    },
  });

  const inviteeMap = new Map(
    existingInviteeEvents.map((ie) => [
      ie.attendee.email || ie.attendee.userName,
      ie,
    ])
  );

  const newInvites = newInvitees.filter((invitee) => !inviteeMap.has(invitee));
  const removedInvites = existingInviteeEvents.filter(
    (ie) => !newInvitees.includes(ie.attendee.email || ie.attendee.userName)
  );

  // process new invitations
  await this.processInvitees(originalEventData, newInvites);

  // process removed invitations
  for (const inviteeEvent of removedInvites) {
    await prisma.eventAttendee.delete({ where: { id: inviteeEvent.id } });
  }
};

const notifyAttendeesOfUpdates = async (eventId, attendees) => {
  // Logic to create and send notifications to attendees
  for (const attendee of attendees) {
    await prisma.notification.create({
      data: {
        userId: attendee.attendeeId,
        eventId: eventId,
        type: "EVENT_UPDATE",
        message: "Event details have been updated.",
        sent: false, // assuming notifications are sent out by a separate process
        sendAt: new Date(), // set appropriate time for sending the notification
      },
    });
  }
};
