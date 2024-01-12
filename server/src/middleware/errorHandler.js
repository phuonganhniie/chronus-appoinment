const CustomError = require("../utils/customError");
const { logger } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  // If headers have already been sent, delegate to the default handler
  if (res.headersSent) {
    return next(res);
  }

  // Define default error
  let message = "Server error";
  let errorCode = -1;
  let statusCode = err.status || 500;

  if (err instanceof CustomError) {
    message = err.message;
    errorCode = err.errorCode;
    statusCode = err.status;
  }

  const errorResponse = {
    statusCode,
    errorCode,
    message,
    data: null,
  };
  logger.error(err);

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
