// Import necessary modules and dependencies
const calendarService = require("../services/calendarService");
const { logger } = require("../utils/logger");

// Controller methods for CRUD operations

// Create a new calendar for a user
exports.createCalendar = async (req, res) => {
  try {
    // const  userId  = req.user.userId;

    const userId = 1;
    const { settings } = req.body;

    // Create a new calendar
    const calendar = await calendarService.createCalendar(userId, settings);

    // Save the calendar to the database
    res.sendData("Calendar created successfully", calendar);
  } catch (error) {
    logger.errorf("Error creating calendar: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};
// Get a user's calendar
exports.getCalendar = async (req, res) => {
  try {
    // const  userId  = req.user.userId;
    const userId = 1;
    // Find the calendar for the specified user
    const calendar = await calendarService.getCalendar(userId);

    res.sendData("Find calendar successfully", calendar);
  } catch (error) {
    logger.errorf("Error finding calendar: %v", error);
    return res.sendError(error.status, error.errorCode, error.message);
  }
};
// Update a user's calendar
exports.updateCalendar = async (req, res) => {
  try {
    // const userId  = req.user.userId;
    const userId = 1;
    const { totalEventTypes } = req.body;
    console.log("check the totalEventTypes data", totalEventTypes);
    // const eventTypes = ["my calendar", "something"];
    // Find and update the calendar for the specified user
    const updatedCalendar = await calendarService.updateCalendar(
      userId,
      totalEventTypes
    );

    res.sendData("Update calendar successfully", updatedCalendar);
  } catch (error) {
    res.status(500).json({ error: "Failed to update calendar" });
  }
};
// Delete a user's calendar
exports.deleteCalendar = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the calendar for the specified user
    const calendar = await Calendar.findOneAndDelete({ userId });

    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    res.json({ message: "Calendar deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete calendar" });
  }
};
