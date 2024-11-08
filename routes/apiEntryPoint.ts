/**
 * @description: This file is the entry point to the right version of API.
 */
import express from "express";
import index from "./api/v1/pesapal/index";
import callback from "./api/v1/pesapal/callback";
import submitOrder from "./api/v1/pesapal/submitOrder";
import authRoutes from "./api/v1/auth/authRoutes";
import isAuth from "./middlewares/isAuth";

const router = express.Router();

// ========================================================================
// pesapal routes not exposed to the public
router.use("/v1/pesapal", index);
router.use("/v1/pesapal", callback);
// ========================================================================

// submitOrder route
router.use("/v1/submitOrder", isAuth, submitOrder);

// auth routes
router.use("/v1/auth", authRoutes);

export default router;
