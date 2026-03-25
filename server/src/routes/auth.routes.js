import express from "express"
import { Register, Logout, Profile } from "../controllers/auth.controller.js"
import { isAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", Register)
router.get("/logout", Logout)
router.get("/profile", isAuth, Profile)

export default router