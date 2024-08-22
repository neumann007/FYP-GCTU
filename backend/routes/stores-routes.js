import express from "express";
import { check } from "express-validator";

import { login, signup } from "../controllers/stores-controllers.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("storeName").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("region").not().isEmpty(),
    check("city").not().isEmpty(),
    check("storeAddress").not().isEmpty(),
    check("telephone").not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

// router.get("/");

export default router;
