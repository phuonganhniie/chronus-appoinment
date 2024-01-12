function responseFormat(req, res, next) {
  res.sendData = function (message, data = "Success") {
    const response = {
      statusCode: 200,
      errorCode: 0,
      message,
      data,
    };
    res.json(response);
  };

  res.sendError = function (statusCode, errorCode, message, data) {
    const response = {
      statusCode: statusCode ?? 500,
      errorCode: errorCode ?? -1,
      message: message ?? "Error",
      data: data ?? null,
    };
    res.status(statusCode).json(response);
  };

  next();
}

module.exports = responseFormat;
