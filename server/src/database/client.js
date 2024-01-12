const { logger } = require("../utils/logger");
const CustomError = require("../utils/customError");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function connectDb() {
  try {
    await prisma.$connect();
    logger.infof("Database connected successfully.");
  } catch (error) {
    throw new CustomError(-1, `Failed to start the server due to database connection error: ${error}`, 500);
  }
}

async function disconnectDb() {
  await prisma.$disconnect();
  logger.info("Database disconnected successfully.");
}

module.exports = {
  prisma,
  connectDb,
  disconnectDb,
};
