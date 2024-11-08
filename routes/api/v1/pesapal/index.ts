/**
 * @description - This file contains the routes related to PesaPal especially the protected ones
 */
import express from "express";
import {
  getAccessToken,
  getIPNUrl,
  PESAPAL_REQ_TOKEN_URL,
  consumer_key,
  consumer_secret,
  REG_IPN_URL,
} from "./pp_utils";
import { tokenType } from "../../../../types";
import pkg_logger from "../../../../logger";

const logger = pkg_logger;

let cached_token: tokenType;

const router = express.Router();

// region Refresh Token
/**
 * @description - This function refreshes the access token and caches it
 * @returns - access token
 */
async function refreshToken() {
  logger.info("Refreshing token...");
  return new Promise((resolve, reject) => {
    getAccessToken({
      url: PESAPAL_REQ_TOKEN_URL,
      consumer_key,
      consumer_secret,
    })
      .then((data) => {
        cached_token = data as tokenType;
        cached_token.createdAt = new Date();
        resolve(cached_token);
      })
      .catch((err) => {
        logger.error("Error", err);
        reject(err);
      });
  });
}
// endregion

// region Get Token
/**
 * @description - This function gets the access token and caches it; If the token has
 * expired (PesaPal Tokens expire after 5mins), it refreshes it.
 * @returns - access token
 */
const getToken = async () => {
  logger.info("Getting token...");
  if (!cached_token) {
    return new Promise((resolve, reject) => {
      refreshToken()
        .then((data) => {
          resolve((data as tokenType).token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } else {
    // check if 5mins have passed since createdAt time
    const now = new Date();
    const diff = now.getTime() - cached_token.createdAt.getTime();
    const diffMins = Math.floor(diff / 60000);
    if (diffMins >= 5) {
      logger.info("Token expired, refreshing...");
      return new Promise((resolve, reject) => {
        refreshToken()
          .then((data) => {
            resolve((data as tokenType).token);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
  return Promise.resolve(cached_token.token);
};
// endregion

// region registerIPN
/**
 * @description: Registers an IPN to PesaPal
 * @param withToken - whether to return the token or not
 * @returns
 */
export function registerIPN(withToken = false) {
  return new Promise((resolve, reject) => {
    getToken()
      .then((data) => {
        const token: string = data as string;

        // headers
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // ================= register IPN ==========================
        fetch(REG_IPN_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            url: getIPNUrl("/pesapal/callback"),
            ipn_notification_type: "POST",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            logger.info("IPN registration successful!");
            if (withToken) {
              resolve({ token, ...data });
            }
            resolve(data);
          })
          .catch((err) => {
            logger.error("Error", err);
            reject({ message: "Error registering IPN" });
          });
        // ========================================================
      })
      .catch((err) => {
        logger.error("Error", err);
        reject({ message: "Error getting token" });
      });
  });
}
// endregion

// region /RegisterIPN
// =============================================================================
/**
 * @description Register IPN
 * @param req - Request
 * @param res - Response
 */
router.get("/register_ipn", (req, res) => {
  logger.info("IPN registration hit");
  registerIPN()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
// =============================================================================
// endregion

export default router;
