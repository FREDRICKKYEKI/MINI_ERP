import { Sequelize } from "sequelize";
import pkg_logger from "../logger";

const logger = pkg_logger;
const { MODE } = process.env;

let db;

// use sqlite in dev mode else use mysql in prod mode
if (MODE === "DEV") {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "../dev_db.db",
  });
} else if (MODE === "PROD") {
  throw new Error("PROD mode db connection not implemented yet");
}

// Test the connection
db.authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

export default db;
