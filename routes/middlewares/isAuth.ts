/**
 * @description: Middleware to check if user is authenticated
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // get token from cookie `MNERP_ACCSS_TOK`
  const token = req.cookies.MNERP_ACCSS_TOK;
  if (!token) {
    res.redirect("/login");
    return;
  }

  // verify the token
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      res.redirect("/login");
      return;
    }

    // set the user to the request object
    req.user = decoded;
    next();
  });
};

export default isAuth;
