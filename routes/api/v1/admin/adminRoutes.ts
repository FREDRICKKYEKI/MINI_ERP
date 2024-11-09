/**
 * @description Admin routes
 *
 */
import expressAsyncHandler from "express-async-handler";
import express from "express";
import User from "../../../../db_engine/models/User";
import Subscription from "../../../../db_engine/models/Subscription";
import Contribution from "../../../../db_engine/models/Contribution";

const router = express.Router();

// region /getAllUserData
router.get(
  "/getAllUserData",
  expressAsyncHandler(async (req, res) => {
    // Retrieve all users with subscriptions and contributions
    throw new Error("Not yet implemented!");
  })
);
// endregion

export default router;
