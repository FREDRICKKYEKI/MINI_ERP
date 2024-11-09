/**
 * @description Contains all routes securely accessed by the cron job
 */
import express from "express";
import expressAsyncHandler from "express-async-handler";
import pkg_sub from "../../../../db_engine/models/Subscription";
import pkg_logger from "../../../../logger";
import User from "../../../../db_engine/models/User";

const logger = pkg_logger;
const Subscription = pkg_sub;
const router = express.Router();

// region /test
// ===========================================================================
router.get(
  "/test",
  expressAsyncHandler(async (req, res) => {
    logger.info("GET /cron/test");
    res.send({ message: "Cron job is working", status: "success" });
  })
);
// endregion
// ===========================================================================

const includeModels = {
  User: User,
  // add other models here
};
// region /tables/subscriptions
// FIXME: For now we are accessing the Subscriptions so other tables might not work
// ===========================================================================
router.post(
  "/tables/subscriptions",
  expressAsyncHandler(async (req, res) => {
    //   for now only the include option is allowed
    const { include } = req.body;
    logger.debug("include", { include });

    if (include) {
      if (!includeModels[include]) {
        res.status(400).send({
          message:
            "Invalid include option. Must be a valid supported db table name.",
        });
        return;
      }
      const data = await Subscription.findAll({
        include: [
          {
            model: includeModels[include],
            as: include,
          },
        ],
      });
      res.send(data);
    } else {
      // send all subscriptions
      const data = await Subscription.findAll();
      res.send(data);
    }
  })
);
// endregion

export default router;
