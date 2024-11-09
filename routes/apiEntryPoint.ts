/**
 * @description: This file is the entry point to the right version of API.
 */
import express from "express";
import index from "./api/v1/pesapal/index";
import callback from "./api/v1/pesapal/callback";
import submitOrder from "./api/v1/pesapal/submitOrder";
import authRoutes from "./api/v1/auth/authRoutes";
import { isAuth, isAdmin } from "./middlewares/middlewares";
import adminRoutes from "./api/v1/admin/adminRoutes";

const router = express.Router();

// ========================================================================
// pesapal routes not exposed to the public NOTE: They should be protected with a secret key
router.use("/v1/pesapal", index);
router.use("/v1/pesapal", callback);
// ========================================================================

// submitOrder route
router.use("/v1/submitOrder", isAuth, submitOrder);

// auth routes
router.use("/v1/auth", authRoutes);

// admin routes
router.use("/v1/admin", isAuth, isAdmin, adminRoutes);

export default router;
