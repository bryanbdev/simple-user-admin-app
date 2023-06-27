import express from "express";
import {
  get_login_page,
  get_register_user_page,
  post_register_user,
  post_login_user,
} from "../controllers/auth.js";
const router = express.Router();

// sign up route
router.get("/register", get_register_user_page);

// sign up user
router.post("/register", post_register_user);

// login user route
router.get("/login", get_login_page);

// login user route
router.post("/login", post_login_user);

export default router;
