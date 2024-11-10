import { Sequelize } from "sequelize";
import pkg_logger from "../logger";

const logger = pkg_logger;
const {
  MODE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PORT,
  USE_SQLITE_PROD,
  REMOTE_MYSQL_URI,
  USE_REMOTE_MYSQL_PROD,
} = process.env;

if (
  !MODE ||
  !MYSQL_USER ||
  !MYSQL_PASSWORD ||
  !MYSQL_DATABASE ||
  !MYSQL_HOST ||
  !MYSQL_PORT ||
  !USE_SQLITE_PROD ||
  !REMOTE_MYSQL_URI ||
  !USE_REMOTE_MYSQL_PROD
) {
  logger.error("Some environment variables are missing. Exiting...");
  process.exit(1);
}

let db;
/**
 * @description Whether to use SQLite in production mode or not
 */
let useSqliteInProd = USE_SQLITE_PROD === "true" ? true : false;

// use sqlite in dev mode else use mysql in prod mode
if (MODE === "DEV") {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "dev_db.db",
  });
} else if (MODE === "PROD") {
  logger.info("MySQL Database setting up...");
  if (useSqliteInProd) {
    logger.info("Using SQLite in production mode");
    db = new Sequelize({
      dialect: "sqlite",
      storage: "prod_db.db",
    });
  } else {
    if (USE_REMOTE_MYSQL_PROD === "true") {
      db = new Sequelize(REMOTE_MYSQL_URI, {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });
    } else {
      db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
        host: MYSQL_HOST,
        dialect: "mysql",
      });
    }
  }
}

// Test the connection
db.authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

const dev_query_all_tables =
  "SELECT name FROM sqlite_master WHERE type='table';";
const prod_query_all_tables = "SHOW TABLES;";
let query_all_tables;

if (useSqliteInProd) {
  query_all_tables = dev_query_all_tables;
} else {
  query_all_tables = prod_query_all_tables;
}
// Query to list tables in SQLite database
db.query(query_all_tables)
  .then((result) => {
    const tables = result[0]; // SQLite query result is in the first element of the array
    logger.info("Tables in the database:", tables);
  })
  .catch((err) => {
    logger.error("Error fetching tables:", err);
  });
export default db;
