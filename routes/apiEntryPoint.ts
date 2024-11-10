/**
 * @description: This file is the entry point to the right version of API.
 * - APIs are versioned to avoid breaking changes when new features are added.
 *
 * Routes:
 * =======
 * - /v1/pesapal/* - routes are not exposed to the public. They should be protected with a secret key.
 * - /v1/submitOrder/* - submit an order to pesapal to get a payment link
 * - /v1/auth/* - authentication routes
 * - /v1/admin/* - admin routes
 * - /v1/cron/* - cron routes
 */
import express from "express";
import index from "./api/v1/pesapal/index";
import callback from "./api/v1/pesapal/callback";
import submitOrder from "./api/v1/pesapal/submitOrder";
import authRoutes from "./api/v1/auth/authRoutes";
import cronRoutes from "./api/v1/cron/cronRoutes";
import { isAuth, isAdmin, isCronAuth } from "./middlewares/middlewares";
import adminRoutes from "./api/v1/admin/adminRoutes";

const router = express.Router();

// region api/v1/* routes
// pesapal routes not exposed to the public NOTE: They should be protected with a secret key
// ========================================================================
router.use("/v1/pesapal", index);
router.use("/v1/pesapal", callback);
// ========================================================================

// submitOrder route
router.use("/v1/submitOrder", isAuth, submitOrder);

// auth routes
router.use("/v1/auth", authRoutes);

// admin routes
router.use("/v1/admin", isAuth, isAdmin, adminRoutes);

// cron routes
router.use("/v1/cron", isCronAuth, cronRoutes);
// endregion
export default router;
