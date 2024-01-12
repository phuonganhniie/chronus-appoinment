const config = require("./src/configs/config");
const { initLogger, logger } = require("./src/utils/logger");
const app = require("./src/app");
const { connectDb, disconnectDb } = require("./src/database/client");

// Initialize logger utility
initLogger();

// Establish database connection before starting server
connectDb()
  .then(() => {
    const server = app.listen(config.port, () => {
      logger.infof("Server is running on http://localhost:%d", config.port);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info("Shutting down server...");

      server.close(async () => {
        logger.info("Server closed.");

        await disconnectDb();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
