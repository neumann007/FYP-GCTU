import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import Store from "../models/store.js";

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { storeName, email, password, region, city, storeAddress, telephone } =
    req.body;

  let existingStore;
  try {
    existingStore = await Store.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingStore) {
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

  const createdStore = new Store({
    storeName,
    email,
    password: hashedPassword,
    region,
    city,
    telephone,
    storeAddress,
    arvRights: "ENABLED",
    accType: "STORE",
  });

  try {
    await createdStore.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdStore._id,
        email: createdStore.email,
        accType: createdStore.accType,
        arvRights: createdStore.arvRights,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Couldn't create user, please try again", 500);
    return next(error);
  }

  res.status(200).json({
    userId: existingStore._id,
    email: existingStore.email,
    accType: existingStore.accType,
    arvRights: existingStore.arvRights,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingStore;
  try {
    existingStore = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  if (!existingStore) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in. Check email and password again",
      401
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingStore.password);
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

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingStore._id,
        email: existingStore.email,
        accType: existingStore.accType,
        arvRights: existingStore.arvRights,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Couldn't create user, please try again", 500);
    return next(error);
  }

  res.json({
    userId: existingStore._id,
    email: existingStore.email,
    accType: existingStore.accType,
    arvRights: existingStore.arvRights,
    token: token,
  });
};

export { signup, login };
