/**
 * @description: Middleware to check if user is authenticated
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { CRON_SERVICE_SECRET } = process.env;

if (!CRON_SERVICE_SECRET) {
  throw new Error(
    "`CRON_SERVICE_SECRET` is not set in the environment variables"
  );
}
// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

/**
 * @description: Middleware to check if user is authenticated
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 * @returns void
 */
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
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

/**
 * @description: Middleware to check if user is an admin
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role_id === 1) {
    next();
  } else {
    res.redirect("/login");
  }
};

/**
 * @description Middleware to check if the request is from the cron service
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const isCronAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (token === CRON_SERVICE_SECRET) {
    next();
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};

/**
 * @description Middleware to redirect authenticated users (for example, from the login page or sign up page)
 * @param req Request
 * @param res Response
 */
export const authRedirect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get token from cookie `MNERP_ACCSS_TOK`
  const token = req.cookies.MNERP_ACCSS_TOK;
  if (!token) {
    next();
    return;
  }

  // verify the token
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      next();
      return;
    }

    // redirect to dashboard if user is authenticated
    res.redirect("/");
  });
};
