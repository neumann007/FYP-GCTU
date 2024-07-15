import express from "express";
import { login, signup } from "../controllers/users-controllers.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

// router.get("/");

export default router;
