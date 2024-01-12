const { prisma } = require("../database/client");
const { logger } = require("../utils/logger");
const { sendEmail } = require("../utils/mailer");
const moment = require("moment");

const sendNotification = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        sent: false,
        sendAt: {
          lte: new Date(),
        },
      },
      include: {
        user: true,
        event: true,
      },
    });

    for (const notification of notifications) {
      const subject =
        notification.type === "REMINDER"
          ? "Event Reminder"
          : "Event Invitation";
      const text = `Reminder for event: ${notification.event.title} at ${moment(
        notification.event.startTime
      ).format("LLL")}`;

      await sendEmail(notification.user.email, subject, text);

      await prisma.notification.update({
        where: { id: notification.id },
        data: { sent: true },
      });
    }
  } catch (error) {
    logger.errorf("Error in sending notifications: %v", error);
  }
};

module.exports = sendNotification;