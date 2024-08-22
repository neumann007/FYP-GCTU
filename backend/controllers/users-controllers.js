import { v4 as uuidv4 } from "uuid";
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
    password,
    // region,
    // city,
    deliveryAddress,
    mobileNumber,
    stateArv,
  } = req.body;

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

  let arvStat = false;
  if (stateArv === "true") {
    console.log(typeof stateArv);
    arvStat = true;
  }

  const createdUser = new User({
    fName,
    lName,
    birthday,
    email,
    password,
    // region,
    // city,
    deliveryAddress,
    mobileNumber,
    isArvUser: arvStat,
    accType: "User",
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

  res.status(200).json({
    user: createdUser.toObject({ getters: true }),
    cart: createdSession.toObject({ getters: true }),
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

  if (!existingUser || existingUser.password !== password) {
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

  res.json({
    message: "Logged In",
    user: existingUser.toObject({ getters: true }),
    cart: shoppingSession,
  });
};

export { signup, login };
