import express from "express";
import pkg_logger from "../../../../logger";
import pkg_trans from "../../../../db_engine/models/Transaction";
import pkg_subs from "../../../../db_engine/models/Subscription";
import pkg_contribution from "../../../../db_engine/models/Contribution";
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
const Contribution = pkg_contribution;
const router = express.Router();

function getDifferenceFromToday(endDateStr: any) {
  const today = new Date() as any; // Get today's date
  today.setHours(0, 0, 0, 0); // Set time to midnight for an accurate day comparison
  const endDate = new Date(endDateStr) as any; // Parse the future date

  // Calculate the difference in milliseconds
  const differenceInMs = endDate - today;

  // Convert milliseconds to days
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return Math.floor(differenceInDays); // Round down to the nearest day
}

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
      const parsedOMR = parseOrderMerchantReference(OrderMerchantReference);

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
        transaction_type: parsedOMR.transaction_type,
        amount: parsedOMR.amount,
        user_id: parsedOMR.user_id,
      });

      // handle the different transaction types
      if (parsedOMR.transaction_type == "subscription") {
        // 3. update the subscription table
        const start_date = new Date();
        // 30 days from now
        const end_date = new Date(
          start_date.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        // check if the user already has a subscription
        const userSubscription = await Subscription.findOne({
          where: { user_id: parsedOMR.user_id },
        });
        if (userSubscription) {
          // NOTE: when a user upgrades their subscription, the money should be prorated,
          // then refunded to the user, then create a new subscription.
          // if difference bettween expiry date and current date is less < 5 days,
          // extend the expiry date,
          if (
            getDifferenceFromToday(
              userSubscription.getDataValue("expiry_date")
            ) < 5
          ) {
            userSubscription.setDataValue(
              "expiry_date",
              end_date.toISOString()
            );
            await userSubscription.save();
            logger.info("Subscription extended");
            return;
          }
          logger.warn("User already has a subscription");
          return;
        }

        // check if the membership type is valid (for debugging purposes)
        if (!["Free", "Pro", "Enterprise"].includes(parsedOMR.sub_type || "")) {
          logger.debug("Invalid membership type");
          throw new Error("Invalid membership type");
        }

        // check if the membership type is provided (for debugging purposes)
        if (!parsedOMR.sub_type) {
          logger.debug("Membership type is required");
          throw new Error("Membership type is required");
        }

        // create a subscription
        const subscription = await Subscription.create({
          transaction_id: OrderTrackingId,
          user_id: parsedOMR.user_id,
          type: parsedOMR.sub_type,
          start_date: start_date.toISOString(),
          expiry_date: end_date.toISOString(),
        });
        // 4. send an email to the user
        // NOTE: this is not implemented yet
        return;
      } else if (parsedOMR.transaction_type == "contribution") {
        // check if the purpose is provided for debugging purposes
        if (!parsedOMR.purpose) {
          logger.error("Purpose is required for contributions");
          throw new Error("Purpose is required for contributions");
          return;
        }
        // 3. update the contributions table
        const contribution = await Contribution.create({
          transaction_id: OrderTrackingId,
          user_id: parsedOMR.user_id,
          purpose: parsedOMR.purpose,
        });
        // 4. send an email to the user
        // NOTE: this is not implemented yet
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
