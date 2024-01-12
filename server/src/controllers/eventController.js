const { logger } = require("../utils/logger");
const eventService = require("../services/eventService");
const {
  setupEventReminder,
  processInvitees,
} = require("../services/eventService");
const { validateEventInput } = require("../services/eventServiceHelpers");

exports.createEvent = async (req, res, next) => {
  try {
    const userId = 1;
    // const userId = req.user.userId;
    const eventData = req.body;

    // Validate event input
    validateEventInput(eventData);

    // Create event in user's calendar
    const newEvent = await eventService.createEvent(userId, eventData);

    // Process invitees
    await processInvitees(newEvent, eventData.invitees);

    // Setup event reminder
    await setupEventReminder(
      newEvent,
      eventData.reminderOption,
      eventData.customReminderTime,
      userId
    );

    res.sendData("Event created successfully", newEvent);
  } catch (error) {
    logger.errorf("Error creating event: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.listEvents = async (req, res, next) => {
  try {
    const { timeframe, year, month, customStartTime, customEndTime } =
      req.query;
    const userId = req.user.userId;

    const events = await eventService.listEvents(
      userId,
      timeframe,
      year,
      month,
      customStartTime,
      customEndTime
    );

    res.sendData("List events retrieved successfully", events);
  } catch (error) {
    logger.errorf("Error listing events: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.userId;

    const event = await eventService.getEventById(userId, eventId);

    res.sendData("Event retrieved successfully", event);
  } catch (error) {
    logger.errorf("Error retrieved event: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const eventData = req.body;
    // const userId = req.user.userId;
    const userId = 1;

    // validateEventInput(eventData);

    const updatedEvent = await eventService.updateEvent(
      eventId,
      eventData,
      userId
    );

    res.sendData("Event updated successfully", updatedEvent);
  } catch (error) {
    logger.errorf("Error updating event: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.userId;

    await eventService.deleteEvent(eventId, userId);

    res.sendData("Event deleted successfully");
  } catch (error) {
    logger.errorf("Error deleting event: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};
