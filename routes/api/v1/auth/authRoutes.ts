/**
 * @description: This file contains all the routes related to the authentication of the user.
 */
import express from "express";

const router = express.Router();

// region /signup
router.post("/signup", (req, res) => {
  const body = req.body;
  //   res.redirect("/login");
  res.json({ message: "Signup route", body });
});
// endregion /signup

// region /login
router.post("/login", (req, res) => {
  const body = req.body;
  //   res.redirect("/login");
  res.json({ message: "Login route", body });
});
// endregion /login

export default router;
