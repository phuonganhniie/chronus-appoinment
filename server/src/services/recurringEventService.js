const ERROR_CODE = require("../constants/errorCode");
const { prisma } = require("../database/client");
const CustomError = require("../utils/customError");
const { getNextOccurrence } = require("./recurringEventServiceHelpers");

const MAX_OCCURRENCES = 50;

exports.createRecurringEvent = async (mainEvent, recurringDetails) => {
  const { pattern, endDate, numberOfOccurrences } = recurringDetails;

  let occurrenceDate = new Date(mainEvent.startTime);
  let recurringEvents = [];
  let maxOccurrences = numberOfOccurrences
    ? Math.min(numberOfOccurrences, MAX_OCCURRENCES)
    : MAX_OCCURRENCES;

  for (let count = 0; count < maxOccurrences; count++) {
    if (endDate && occurrenceDate > new Date(endDate)) {
      break;
    }

    // calculate the end time for each occurrence based on the event's duration
    let duration = mainEvent.endTime - mainEvent.startTime;
    let occurrenceEndTime = new Date(occurrenceDate.getTime() + duration);

    recurringEvents.push({
      eventId: mainEvent.id,
      pattern: pattern,
      startDate: new Date(occurrenceDate),
      endDate: occurrenceEndTime,
    });

    // calculate next occurrences based on the pattern
    occurrenceDate = getNextOccurrence(occurrenceDate, pattern);
  }

  // create recurring events
  await prisma.recurringEvent.createMany({
    data: recurringEvents,
  });
};

exports.handleAddRecurringOption = async (eventId, recurringDetails) => {
  const mainEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!mainEvent) {
    throw new CustomError(
      404,
      ERROR_CODE.EVENT_NOT_FOUND,
      "Main event not found"
    );
  }

  // check and delete existed recurring events
  const existingRecurring = await prisma.recurringEvent.findMany({
    where: { eventId: eventId },
  });

  if (existingRecurring.length > 0) {
    await prisma.recurringEvent.deleteMany({ where: { eventId: eventId } });
  }

  await this.createRecurringEvent(mainEvent, recurringDetails);
};

exports.handleRemoveRecurringOption = async (eventId) => {
  await prisma.recurringEvent.deleteMany({
    where: { eventId: eventId },
  });
};
