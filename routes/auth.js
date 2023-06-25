import express from "express";
import {
  get_register_user_page,
  post_register_user,
} from "../controllers/auth.js";
const router = express.Router();

// sign up route
router.get("/register", get_register_user_page);

// sign up user
router.post("/register", post_register_user);

export default router;
