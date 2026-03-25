import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
export const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  )
}