/**
 * @description: This file is the entry point to the right version of API.
 */
import express from "express";
import index from "./api/v1/pesapal/index";
import callback from "./api/v1/pesapal/callback";
import submitOrder from "./api/v1/pesapal/submitOrder";

const router = express.Router();

// ========================================================================
// pesapal routes not exposed to the public
router.use("/v1/pesapal", index);
router.use("/v1/pesapal", callback);
// ========================================================================

// submitOrder route
router.use("/v1/submitOrder", submitOrder);

export default router;
