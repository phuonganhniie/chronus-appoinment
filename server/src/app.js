const express = require("express");
const {
  errorHandler,
  logRequest,
  bodyParser,
  cors,
  responseFormat,
} = require("./middleware");
const CustomError = require("./utils/customError");
const { logger } = require("./utils/logger");
const CronJob = require("cron").CronJob;
const sendNotification = require("./services/notificationService");

const ROUTES = require("./constants/routePaths");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const calendarRoutes = require("./routes/calendarRoutes");

const app = express();

app.use(cors);
app.use(bodyParser);
app.use(logRequest);
app.use(responseFormat);

// Routes
app.use(ROUTES.AUTH.BASE, authRoutes);
app.use(ROUTES.USER.BASE, userRoutes);
app.use(ROUTES.EVENTS.BASE, eventRoutes);
app.use(ROUTES.CALENDARS.BASE, calendarRoutes);

// Catch all unhandled routes and other errors
app.use((req, res, next) => {
  next(new CustomError(404, "Route Not Found", 404));
});
app.use(errorHandler);

// Running check and sending notifications job
// logger.info("Before job instantiation");
// const job = new CronJob(
//   "0 */1 * * * *",
//   function () {
//     logger.info("Running the notification check every minute");
//     sendNotification();
//   },
//   null,
//   true,
// );
// logger.info("After job instantiation");
// job.start();

module.exports = app;
