const express = require("express");

const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: true });

function bodyParser(req, res, next) {
  if (req.is("json")) {
    return jsonParser(req, res, next);
  }

  if (req.is("urlencoded")) {
    return urlEncodedParser(req, res, next);
  }

  next();
}

module.exports = bodyParser;
