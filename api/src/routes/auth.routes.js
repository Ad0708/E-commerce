import express from "express";
import { signup, login, logout, getme, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyAnyToken } from "../middlewares/auth.middleware.js";
import { authLimiter, meLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

router.get("/me", meLimiter, verifyAnyToken, getme);

export default router;
