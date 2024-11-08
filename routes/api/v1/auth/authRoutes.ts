/**
 * @description: This file contains all the routes related to the authentication of the user.
 */
import express from "express";
import pkg_user from "../../../../db_engine/models/User";
import pkg_db from "../../../../db_engine/db";
import pkg_role from "../../../../db_engine/models/Role";
import pkg_logger from "../../../../logger";
import expressAsyncHandler from "express-async-handler";
import { validateRegistrationDetails } from "../../../utils";
import { SignUpRequestType } from "../../../../types";

const router = express.Router();
const logger = pkg_logger;
const db = pkg_db;

// ================================ db models ========================================
const User = pkg_user;
const Role = pkg_role;
// ===================================================================================

// region /roles
router.get(
  "/roles",
  expressAsyncHandler(async (req, res) => {
    // get only the first 2 roles (where id < 3)
    // other roles aren't exposed to the public
    try {
      const roles = await Role.findAll({
        where: {
          id: {
            [db.Sequelize.Op.lt]: 3,
          },
        },
      });
      res.json(roles);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
// endregion

// region /signup
router.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    try {
      const body = req.body as SignUpRequestType;
      // validate the registration details
      const { message, error } = validateRegistrationDetails(body);

      if (error) {
        logger.error(message);
        res.redirect(`/signup?error=${message}`);
        return;
      }

      // create a new user
      await User.create({
        name: `${body.first_name} ${body.last_name}`,
        email: body.email,
        phone: body.phone,
        password: body.password,
        role_id: parseInt(body.role),
      });

      res.redirect("/login?signup=success");
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
// endregion /signup

// region /login
router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.redirect("/login?error=Email and password are required");
      return;
    }

    // find the user with the email
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        res.redirect("/login?error=User not found");
        return;
      }

      // check if the password is correct
      const isPasswordCorrect = user.comparePassword(password);
      if (!isPasswordCorrect) {
        res.redirect("/login?error=Invalid password");
        return;
      }

      // create a token
      const token = user.generateToken();
      res.cookie("MNERP_ACCSS_TOK", token, {
        // MNERP_ACCSS_TOK is the name of the cookie
        httpOnly: true,
        // secure: true, // TODO: Enable this in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.redirect("/");
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }

    // res.json({ message: "Login route" });
  })
);
// endregion /login

export default router;
