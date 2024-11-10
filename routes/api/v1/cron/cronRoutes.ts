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
    logger.info("[GET] /cron/test");
    res.send({ message: "Cron job is working", status: "success" });
  })
);
// endregion
// ===========================================================================

const includeModels = {
  User: User,
  // add other models here
};

router.post(
  "/tables/subscriptions/update",
  expressAsyncHandler(async (req, res) => {
    type req_body_type = {
      col: { [col_name: string]: string };
      options: { where: { id: string } };
    };

    const { col, options } = req.body as req_body_type;
    logger.info("row", col);
    logger.info("options", options);
    if (!col || !options) {
      res.status(400).send({
        message: "Invalid request. Must contain col and options fields.",
      });
      return;
    }

    try {
      // check if subscription exists
      const sub = await Subscription.findOne({
        where: { id: options.where.id },
      });

      if (!sub) {
        res.status(404).send({
          message: "Subscription not found",
          status: "404",
        });
        return;
      }
      // update subscription
      sub[col.col_name] = col.value;
      const _data = await sub.save();

      res.send({
        message: "Subscription updated successfully",
        status: "200",
      });
    } catch (error) {
      logger.error("Error updating subscription", error);
      res.status(500).send({
        message: "Error updating subscription",
        status: "500",
      });
    }
  })
);
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
      // expose only active subscriptions
      const data = await Subscription.findAll({
        where: {
          status: "active",
        },
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
