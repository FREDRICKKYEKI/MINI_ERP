/**
 * @description: This file contains utility functions used in the api routes.
 */

import { SignUpRequestType, ValidationReturnType } from "../types";
import pkg_jwt from "jsonwebtoken";

const jwt = pkg_jwt;

/**
 * @description This function validates the registration details
 * NOTE: This function is not complete. More validation checks need to be researched and added
 * @param body - The request body
 * @typedef SignUpRequestType
 * @returns {object} - An object containing the message and error status
 */
export const validateRegistrationDetails = (
  body: SignUpRequestType
): ValidationReturnType => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    confirm_password,
    role,
  } = body;
  // - Check if all fields are present
  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !password ||
    !confirm_password
  ) {
    return { message: "Some fields are missing", error: true };
  }

  // - Check if password and confirm_password match
  if (password !== confirm_password) {
    return { message: "Passwords do not match", error: true };
  }
  // - Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { message: "Invalid email", error: true };
  }
  // - Check if phone is valid
  // - Phone number should be 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return { message: "Invalid phone number", error: true };
  }

  // validate the role
  // check if int
  if (isNaN(parseInt(role))) {
    console.log(typeof role);
    return { message: "Invalid role. Must an int", error: true };
  }
  // check if role is in the list of roles
  const roles = [1, 2];
  if (!roles.includes(parseInt(role))) {
    return { message: "Invalid role. Must be 1 or 2", error: true };
  }

  return { message: "All fields are present", error: false };
};

/**
 * @description This function checks if the user is authenticated
 * @param req - The request object
 * @returns {boolean} - A boolean indicating if the user is authenticated
 */
export const checkAuth = async (req): Promise<boolean> => {
  // Get the token from the request cookies
  const token = req.cookies.MNERP_ACCSS_TOK;

  if (!token) {
    return false; // No token provided
  }

  try {
    // Verify the token asynchronously
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
          reject(err); // Reject the promise if the token is invalid
        }

        const { id, email, role } = decoded as any;
        req.user = {
          id,
          email,
          role,
        }; // Set the user object in the request
        resolve(decoded); // Resolve with decoded token if successful
      });
    });

    return true;
  } catch (err) {
    console.log("Error verifying token", err);
    return false;
  }
};
