const { createLogger, format, transports } = require("winston");
const sprintf = require("sprintf-js").sprintf;
require("winston-daily-rotate-file");

function initLogger() {}

async function getStackTrace() {
  const stackTrace = await import("stack-trace");
  return stackTrace;
}

// Logs rotation
const fileTransport = new transports.DailyRotateFile({
  filename: "./logs/server-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d",
});

// Custom printed log format
const customFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} - ${level} - ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat
  ),
  transports: [new transports.Console(), fileTransport],
});

// getCallerInfo() for tracing which log info/error is came from
async function getCallerInfo() {
  const stackTrace = await getStackTrace();
  const trace = stackTrace.get();

  const caller = trace[1];
  if (!caller) {
    return "file-unknown:line-unknown";
  }

  let file = caller.getFileName();
  const line = caller.getLineNumber();

  const nameIndex = file.indexOf('/server/')
  if (nameIndex !== -1) {
    file = file.substring(nameIndex)
  }

  return `${file}:${line}`;
}

logger.infof = async function (message, ...args) {
  const callerInfo = await getCallerInfo();
  const formattedMessage = sprintf(message, ...args);
  this.info(`${callerInfo} - ${formattedMessage}`);
};

logger.errorf = async function (message, ...args) {
  const callerInfo = await getCallerInfo();
  const formattedMessage = sprintf(message, ...args);
  this.error(`${callerInfo} - ${formattedMessage}`);
};

module.exports = { initLogger, logger };
