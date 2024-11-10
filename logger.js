import log4js from "log4js";
import { configDotenv } from "dotenv";

configDotenv({ path: "BACKEND.ENV" });

const { MODE } = process.env;

const logger = log4js.getLogger();
if (!MODE) {
  logger.error("`MODE` env variable is required!!!");
  throw new Error("`MODE` env variable is required!!!");
} else if (["DEV", "PROD"].includes(MODE) === false) {
  logger.error("`MODE` env variable must be either `DEV` or `PROD`!!!");
  throw new Error("`MODE` env variable must be either `DEV` or `PROD`!!!");
} else if (MODE === "DEV") {
  logger.level = "debug";
} else {
  logger.level = "info";
}

export default logger;
