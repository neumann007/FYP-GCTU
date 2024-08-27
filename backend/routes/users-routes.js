import express from "express";
import { check } from "express-validator";

import { login, signup } from "../controllers/users-controllers.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("fName").not().isEmpty(),
    check("lName").not().isEmpty(),
    check("birthday").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("ethAccount").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("region").not().isEmpty(),
    check("city").not().isEmpty(),
    check("deliveryAddress").not().isEmpty(),
    check("mobileNumber").not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

// router.get("/");

export default router;
