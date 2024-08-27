import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import Cart from "../models/cart.js";

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const {
    fName,
    lName,
    birthday,
    email,
    ethAccount,
    password,
    region,
    city,
    deliveryAddress,
    mobileNumber,
    stateArv,
  } = req.body;

  console.log(req.body);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Server error, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could  not create user, please try again",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    fName,
    lName,
    birthday,
    email,
    ethAccount,
    password: hashedPassword,
    region,
    city,
    deliveryAddress,
    mobileNumber,
    arvRights: stateArv,
    accType: "USER",
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  const createdSession = new Cart({
    userId: createdUser._id,
    totalPrice: 0,
    itemsCount: 0,
  });

  try {
    await createdSession.save();
  } catch (err) {
    const error = new HttpError("Couldn't create user, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        accType: createdUser.accType,
        arvRights: createdUser.arvRights,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Couldn't create user, please try again", 500);
    return next(error);
  }

  // console.log(createdUser);
  // console.log(token);

  return res.status(201).json({
    userId: createdUser._id,
    email: createdUser.email,
    accType: createdUser.accType,
    arvRights: createdUser.arvRights,
    cart: createdSession.toObject({ getters: true }),
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in. Check email and password again",
      401
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in. Check email and password again",
      401
    );
    return next(error);
  }

  let shoppingSession;
  try {
    shoppingSession = await Cart.find({ userId: existingUser._id });
  } catch (err) {
    const error = new HttpError(
      "Fetching product failed, please try again",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        accType: existingUser.accType,
        arvRights: existingUser.arvRights,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Couldn't create user, please try again", 500);
    return next(error);
  }

  res.json({
    userId: existingUser._id,
    email: existingUser.email,
    accType: existingUser.accType,
    arvRights: existingUser.arvRights,
    cart: shoppingSession,
    token: token,
  });
};

export { signup, login };
