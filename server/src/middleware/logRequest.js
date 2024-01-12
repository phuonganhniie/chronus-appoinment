const { logger } = require("../utils/logger");

function logRequest(req, res, next) {
  const { method, url, headers, query, body } = req;

  // anonymize or omit sensitive information
  const safeHeaders = { ...headers };
  if (safeHeaders.authorization) {
    safeHeaders.authorization = "***";
  }

  const bodyLog = body
    ? JSON.stringify(body).substring(0, 250) +
      (JSON.stringify(body).length > 250 ? "..." : "")
    : "No Body";

  // Log response status and time
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.infof(
      "status: %d - method: %s %s - %dms - query: %v - body: %s",
      res.statusCode,
      method,
      url,
      duration,
      JSON.stringify(query),
      bodyLog
    );
  });

  next();
}

module.exports = logRequest;
