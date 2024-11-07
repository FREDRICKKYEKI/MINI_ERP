/**
 * @description: This file is the entry point to the right version of API.
 */
import express from "express";
import index from "./api/v1/pesapal/index";
import callback from "./api/v1/pesapal/callback";

const router = express.Router();

// pesapal routes
router.use("/v1/pesapal", index);
router.use("/v1/pesapal", callback);

export default router;
