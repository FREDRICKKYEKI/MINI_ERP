/**
 * @description: contains endpoints related to payments to pesapal
 */
import express from "express";
import { registerIPN } from ".";
import expressAsyncHandler from "express-async-handler";
import { IPNRegResponseType, SubmitOrderResponseType } from "../../../../types";
import pkg_logger from "../../../../logger";
import { PESAPAL_SUBMIT_ORDER_URL } from "./pp_utils";

const router = express.Router();
const logger = pkg_logger;

const { IPN_BASE_URL } = process.env;

// region /register_membership
router.post(
  "/register_membership",
  expressAsyncHandler(async (req, res) => {
    try {
      logger.info("POST /register_membership");
      // TODO: add necessary security to prevent abuse of this endpoint

      // register the IPN
      // FIXME: NOTE: technically, the IPN should be registered once and the ipn_id stored in the database,
      // but for the sake of this demo, we will register the IPN every time this endpoint is hit
      const ipn_reg_data = (await registerIPN(true).catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      })) as IPNRegResponseType;

      // get the ipn_id
      const ipn_id = ipn_reg_data.ipn_id;
      const token = ipn_reg_data.token;

      // get body from request
      const { price, type } = req.body;
      const { id } = (req as any).user; // any because user is not defined in Request type

      // validate the request body
      if (!price || !type) {
        res.status(400).json({ message: "price and type are required!" });
        return;
      }
      const unique_id = crypto.randomUUID();
      const payload = {
        id: `subscription?amount=1&sub_type=${type}&user_id=${id}&unique_id=${unique_id}`,
        currency: "KES",
        // amount: MODE === "DEV" ? 1 : price, //TODO: uncomment this line For production
        amount: 1, //TODO: remove this line For production
        description: "Membership registration",
        callback_url: "http://localhost:5173/success?type=subscription",
        redirect_mode: "",
        notification_id: ipn_id,
        branch: "MINI ERP", // TODO: create a branch name for this transaction
        billing_address: {
          country_code: "KE",
          // TODO: dynamically get the user's details
          email_address: "me@fredrickkyeki.tech",
          phone_number: "0799715665",
          first_name: "FRED", //
          middle_name: "ISAAC",
          last_name: "KYEKI",
          line_1: "MINI ERP | subscription",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: "",
        },
      };

      // required submitorder request headers
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // make the submitorder request to pesapal
      await fetch(PESAPAL_SUBMIT_ORDER_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "200") {
            logger.error(data.error);
            console.error("\npayload: ", payload);
            console.error("\nheaders: ", headers);
            res
              .status(500)
              .json({ message: "Internal server error", error: data.error });
          } else {
            logger.info("Submit order successful");
            res.redirect((data as SubmitOrderResponseType).redirect_url);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
// ==============================================================================
// endregion

// region /make_contribution
// ==============================================================================
// NOTE: This is just an example of how a contribution would work and most of the code
//  here is similar to the / register_membership endpoint
// SHOULD BE A POST REQUEST BUT FOR THE SAKE OF THIS DEMO, IT IS A GET REQUEST
// because we expect some details to be passed in the body (e.g, amount, purpose, etc)
router.get(
  "/make_contribution",
  expressAsyncHandler(async (req, res) => {
    try {
      logger.info("POST /make_contribution");
      // TODO: add necessary security to prevent abuse of this endpoint

      // register the IPN
      // FIXME: NOTE: technically, the IPN should be registered once and the ipn_id stored in the database,
      // but for the sake of this demo, we will register the IPN every time this endpoint is hit
      const ipn_reg_data = (await registerIPN(true).catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      })) as IPNRegResponseType;

      // an example contribution purpose
      const example_contribution_purpose = "Tithe";
      // get the ipn_id
      const ipn_id = ipn_reg_data.ipn_id;
      const token = ipn_reg_data.token;
      const { id } = (req as any).user;
      const unique_id = crypto.randomUUID();
      const payload = {
        id: `contribution?amount=1&user_id=${id}&unique_id=${unique_id}&purpose=${example_contribution_purpose}`,
        currency: "KES",
        // amount: MODE === "DEV" ? 1 : price, //TODO: uncomment this line For production
        amount: 1, //TODO: remove this line For production
        description: "Contribution",
        callback_url: "http://localhost:5173/success?type=contribution",
        redirect_mode: "",
        notification_id: ipn_id,
        branch: "MINI ERP", // TODO: create a branch name for this transaction
        billing_address: {
          country_code: "KE",
          // TODO: dynamically get the user's details
          email_address: "me@fredrickkyeki.tech",
          phone_number: "0799715665",
          first_name: "FRED", //
          middle_name: "ISAAC",
          last_name: "KYEKI",
          line_1: "MINI ERP | contribution",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: "",
        },
      };

      // required submitorder request headers
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // make the submitorder request to pesapal
      await fetch(PESAPAL_SUBMIT_ORDER_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "200") {
            logger.error(data.error);
            console.error("\npayload: ", payload);
            console.error("\nheaders: ", headers);
            res.status(500).json({ message: "Internal server error" });
            return;
          } else {
            logger.info("Submit order successful");
            res.redirect((data as SubmitOrderResponseType).redirect_url);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
// endregion
export default router;
