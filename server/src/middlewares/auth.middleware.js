import jwt from "jsonwebtoken"
import { ENV } from "../config/ENV.js";

export const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(409).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(409).json({ message: "invalid token" })
    }
    req.userId = decoded.userId;
    next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
