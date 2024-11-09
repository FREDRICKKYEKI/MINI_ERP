import { Sequelize } from "sequelize";
import pkg_logger from "../logger";

const logger = pkg_logger;
const { MODE } = process.env;

let db;

// use sqlite in dev mode else use mysql in prod mode
if (MODE === "DEV") {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "dev_db.db",
  });
} else if (MODE === "PROD") {
  // throw new Error("PROD mode db connection not implemented yet");
  logger.warn(
    "MYSQL connection not implemented yet. Still using sqlite in DEV mode."
  );
  db = new Sequelize({
    dialect: "sqlite",
    storage: "prod_db.db",
  });
}

// Test the connection
db.authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

// Query to list tables in SQLite database
db.query("SELECT name FROM sqlite_master WHERE type='table';")
  .then((result) => {
    const tables = result[0]; // SQLite query result is in the first element of the array
    logger.info("Tables in the database:", tables);
  })
  .catch((err) => {
    logger.error("Error fetching tables:", err);
  });
export default db;
