import express from "express";
import {
  get_edit_user_page,
  get_user_dashboard,
  put_edit_user,
} from "../controllers/user.js";
import { doUserExist, requireAuth } from "../middleware/auth.js";
import { logout_user } from "../controllers/auth.js";
const router = express.Router();

// check for user in every get request route
router.get("*", doUserExist);

// get user dashboard route
router.get("/dashboard", requireAuth, get_user_dashboard);

// get user update route
router.get("/edit", requireAuth, get_edit_user_page);

// get user update route
router.put("/edit", requireAuth, put_edit_user);

// log out user
router.get("/logout", requireAuth, logout_user);

export default router;
