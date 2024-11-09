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
import { getToken } from ".";

const logger = pkg_logger;
const Transaction = pkg_trans;
const Subscription = pkg_subs;
const router = express.Router();

// region /callback
// ===========================================================================
/**
 * IMPORTANT_NOTE: This endpoint is called by PesaPal after a transaction is
 * completed or failed ``DO NOT REDIRECT OR SEND A RESPONSE BACK TO PESAPAL!!!``
 */
router.post(
  "/callback",
  expressAsyncHandler(async (req, res) => {
    const { OrderMerchantReference, OrderNotificationType, OrderTrackingId } =
      req.body as SubmitOrderCallbackResponseType;

    // check transaction status
    try {
      // get pesapal access token
      const token = await getToken();

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(QUERY_STATUS_URL + OrderTrackingId, {
        method: "GET",
        headers,
      });
      const data = (await response.json()) as TransactionStatusResponseType;

      if (data.status_code !== 1) {
        logger.debug("data", data);
        logger.debug("headers", headers);
        logger.error("Transaction failed");
        return;
      }
      // if successful,
      // update the order status in the database
      // (transaction table, subscription table or contributions table),
      // redirect to the success url

      // 1. parse the OrderMerchantReference
      const { transaction_type, amount, sub_type, user_id } =
        parseOrderMerchantReference(OrderMerchantReference);

      // check if trnsaction_id exists in the database
      const transactionExists = await Transaction.findOne({
        where: { id: OrderTrackingId },
      });
      if (transactionExists) {
        logger.warn("Transaction already exists");
        return;
      }
      // 2. create the transaction status in the database
      const transaction = await Transaction.create({
        id: OrderTrackingId,
        transaction_type: transaction_type,
        amount: amount,
        user_id: user_id,
      });

      // handle the different transaction types
      if (transaction_type == "subscription") {
        // 3. update the subscription table
        const start_date = new Date();
        // 30 days from now
        const end_date = new Date(
          start_date.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        // check if the user already has a subscription
        const userSubscription = await Subscription.findOne({
          where: { user_id: user_id },
        });

        if (userSubscription) {
          // NOTE: when a user upgrades their subscription, the money should be prorated,
          // then refunded to the user, hen create a new subscription.
          logger.warn("User already has a subscription");
          return;
        }

        // create a subscription
        const subscription = await Subscription.create({
          transaction_id: OrderTrackingId,
          user_id: user_id,
          type: sub_type,
          start_date: start_date.toISOString(),
          expiry_date: end_date.toISOString(),
        });
        // 4. send an email to the user
        // NOTE: this is not implemented yet
        return;
      } else if (transaction_type == "contribution") {
        logger.warn("Contribution model not implemented yet!");
        throw new Error("Not implemented yet!");
      } else {
        logger.error("Invalid membership type");
        return;
      }
      // =============================== Done ========================================================
    } catch (err) {
      logger.error(err);
      return;
    }

    // if failed, log the error,
    // (possibly send an email to the user)
    // redirect to the success with an error url param message
  })
);

export default router;
