import express from "express";
import pkg_logger from "../../../../logger";

const logger = pkg_logger;
const router = express.Router();

/**
 * @description Callback URL
 * @param req - Request
 * @param res - Response
 */
router.post("/callback", (req, res) => {
  logger.info("Callback URL hit");
  logger.info(req.body);
  res.send("Callback URL hit");
});

export default router;
