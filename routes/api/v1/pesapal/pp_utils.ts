/**
 * @description - Pesapal utility functions and variables
 */

import pkg_logger from "../../../../logger";
import { parsedOrderMerchantReferenceType } from "../../../../types";

const logger = pkg_logger;
// region utility variables
// =====================================================================
// Environment variables
const {
  MODE,
  PESAPAL_REQ_TOKEN_DEMO_URL,
  PESAPAL_REQ_TOKEN_PROD_URL,
  PROD_PESAPAL_consumer_secret,
  PROD_PESAPAL_consumer_key,
  DEV_PESAPAL_consumer_key,
  DEV_PESAPAL_consumer_secret,
  PESAPAL_REG_IPN_DEMO_URL,
  PESAPAL_REG_IPN_PROD_URL,
  PESAPAL_QUERY_STATUS_PROD_URL,
  PESAPAL_QUERY_STATUS_DEMO_URL,
  PESAPAL_SUBMIT_ORDER_DEMO_URL,
  PESAPAL_SUBMIT_ORDER_PROD_URL,
} = process.env;

export let PESAPAL_REQ_TOKEN_URL: string;
export let consumer_key: string;
export let consumer_secret: string;
export let REG_IPN_URL: string;
export let PESAPAL_SUBMIT_ORDER_URL: string;
export let QUERY_STATUS_URL: string;
export let QUERY_STATUS_DEMO_URL: string;
export let QUERY_STATUS_PROD_URL: string;

// Check if environment variables are set
// FIXME: This is probably not the best way to check if environment variables are set
if (
  !PESAPAL_REQ_TOKEN_DEMO_URL ||
  !PESAPAL_REQ_TOKEN_PROD_URL ||
  !PROD_PESAPAL_consumer_key ||
  !PROD_PESAPAL_consumer_secret ||
  !DEV_PESAPAL_consumer_key ||
  !DEV_PESAPAL_consumer_secret ||
  !PESAPAL_REG_IPN_DEMO_URL ||
  !PESAPAL_REG_IPN_PROD_URL ||
  !PESAPAL_QUERY_STATUS_PROD_URL ||
  !PESAPAL_QUERY_STATUS_DEMO_URL ||
  !PESAPAL_SUBMIT_ORDER_DEMO_URL ||
  !PESAPAL_SUBMIT_ORDER_PROD_URL
) {
  throw new Error("Some environment variables are missing");
}

// get appropriate environment variables
if (MODE === "DEV") {
  PESAPAL_REQ_TOKEN_URL = PESAPAL_REQ_TOKEN_DEMO_URL;
  consumer_key = DEV_PESAPAL_consumer_key;
  consumer_secret = DEV_PESAPAL_consumer_secret;
  REG_IPN_URL = PESAPAL_REG_IPN_DEMO_URL;
  PESAPAL_SUBMIT_ORDER_URL = PESAPAL_SUBMIT_ORDER_DEMO_URL;
  QUERY_STATUS_URL = PESAPAL_QUERY_STATUS_DEMO_URL;
} else {
  PESAPAL_REQ_TOKEN_URL = PESAPAL_REQ_TOKEN_PROD_URL;
  consumer_key = PROD_PESAPAL_consumer_key;
  consumer_secret = PROD_PESAPAL_consumer_secret;
  REG_IPN_URL = PESAPAL_REG_IPN_PROD_URL;
  PESAPAL_SUBMIT_ORDER_URL = PESAPAL_SUBMIT_ORDER_PROD_URL;
  QUERY_STATUS_URL = PESAPAL_QUERY_STATUS_PROD_URL;
}
// endregion
// TODO: add a check to check the availability of all selected environment variables

// ========================================================================================
// region utility functions
type paramsType = {
  url: string;
  consumer_key: string;
  consumer_secret: string;
};

/**
 * @description Get access token
 * @param params - url, consumer_key, consumer_secret
 * @returns - access token
 */
export const getAccessToken = async (params: paramsType) => {
  const { url, consumer_key, consumer_secret } = params;
  // headers
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // payload
  const body = {
    consumer_key,
    consumer_secret,
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.status !== "200") {
          reject(data);
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @description Get IPN URL
 * @param path - the to the callback route e.g `/pesapal/callback`
 * - Must start with `/`
 * @returns
 */
export const getIPNUrl = (path: string) => {
  const IPN_BASE_URL: string | undefined = process.env.IPN_BASE_URL;
  const API_VERSION: string | undefined = process.env.API_VERSION;

  // the envs must be defined!!!
  if (!IPN_BASE_URL) {
    throw new Error("IPN_BASE_URL is not defined");
  } else if (!API_VERSION) {
    throw new Error("API_VERSION is not defined");
  }

  return `${IPN_BASE_URL}/api/${API_VERSION}${path}`;
};
// endregion

/**
 * @description Parse the OrderMerchantReference
 * - sample OrderMerchantReference: `membership_subscription?amount=1&membership_type=${type}&user_id=${id}&unique_id=${unique_id}`
 * @param OrderMerchantReference - the OrderMerchantReference from the callback
 * @returns
 */
export const parseOrderMerchantReference = (
  OrderMerchantReference: string
): parsedOrderMerchantReferenceType => {
  //
  // which corresponds to: transcation_type?amount=1&membership_type=1&user_id=1&unique_id={unique_id}

  // first split the OrderMerchantReference by "?"
  const [transaction_type, params] = OrderMerchantReference.split("?");

  // split the params by "&"
  const paramsArray = params.split("&");

  // create an object to store the params
  const paramsObj: any = {};

  // loop through the paramsArray and split by "="
  paramsArray.forEach((param) => {
    const [key, value] = param.split("=");
    paramsObj[key] = value;
  });

  paramsObj.transaction_type = transaction_type;

  logger.debug("parsedOrderMerchantReference:", paramsObj);

  return paramsObj;
};
