const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  credentials: true,
};

module.exports = cors(corsOptions);
