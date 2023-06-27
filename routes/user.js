import express from "express";
import { get_user_dashboard } from "../controllers/user.js";
import { doUserExist, requireAuth } from "../middleware/auth.js";
import { logout_user } from "../controllers/auth.js";
const router = express.Router();

// check for user in every get request route
router.get("*", doUserExist);

// get user dashboard route
router.get("/dashboard", requireAuth, get_user_dashboard);

// log out user
router.get("/logout", requireAuth, logout_user);

export default router;
