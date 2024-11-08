import express from "express";
import pkg_logger from "../../../../logger";
import pkg_trans from "../../../../db_engine/models/Transaction";
import pkg_subs from "../../../../db_engine/models/Subscription";
import {
  SubmitOrderCallbackResponseType,
  TransactionStatusResponseType,
} from "../../../../types";
import expressAsyncHandler from "express-async-handler";
import {
  consumer_key,
  getAccessToken,
  parseOrderMerchantReference,
  QUERY_STATUS_URL,
  REG_IPN_URL,
} from "./pp_utils";

const logger = pkg_logger;
const Transaction = pkg_trans;
const Subscription = pkg_subs;
const router = express.Router();

// region /callback
/**
 * @description Callback URL
 * @param req - Request
 * @param res - Response
 */
router.post(
  "/callback",
  expressAsyncHandler(async (req, res) => {
    const { OrderMerchantReference, OrderNotificationType, OrderTrackingId } =
      req.body as SubmitOrderCallbackResponseType;

    // check transaction status
    try {
      // get pesapal access token
      const token = await getAccessToken({
        url: REG_IPN_URL,
        consumer_key: consumer_key,
        consumer_secret: consumer_key,
      });

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(QUERY_STATUS_URL + OrderTrackingId, {
        headers,
      });
      const data = (await response.json()) as TransactionStatusResponseType;

      // if successful,
      // update the order status in the database
      // (transaction table, subscription table or contributions table),
      // redirect to the success url

      // 1. parse the OrderMerchantReference
      const { transaction_type, amount, membership_type, user_id } =
        parseOrderMerchantReference(OrderMerchantReference);

      // 2. create the transaction status in the database
      const transaction = await Transaction.create({
        id: OrderTrackingId,
        transaction_type: transaction_type,
        amount: amount,
        user_id: user_id,
      });

      if (membership_type == "subscription") {
        // 3. update the subscription table
        const start_date = new Date();
        // 30 days from now
        const end_date = new Date(
          start_date.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const subscription = await Subscription.create({
          transaction_id: OrderTrackingId,
          start_date: start_date.toISOString(),
          expiry_date: end_date.toISOString(),
        });
        // 4. send an email to the user
        // NOTE: this is not implemented yet

        // 5. redirect to the success url
        res.redirect("/success?message=Order was successful");
      } else if (membership_type == "contribution") {
        logger.warn("Contribution model not implemented yet!");
        throw new Error("Not implemented yet!");
      } else {
        logger.error("Invalid membership type");
        res.redirect("/success?error=Invalid membership type");
      }
      // =============================== Done ========================================================
    } catch (err) {
      logger.error(err);
      res.redirect(
        "/success?error=An error occurred while processing the order"
      );
    }

    // if failed, log the error,
    // (possibly send an email to the user)
    // redirect to the success with an error url param message
  })
);

export default router;
