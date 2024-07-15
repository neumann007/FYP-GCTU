import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/user.js";

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const {
    fullname,
    dob,
    email,
    username,
    password,
    deliveryAddress,
    location,
    mobileNumber,
    isArvUser,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    fullname,
    dob,
    email,
    username,
    password,
    deliveryAddress,
    location,
    mobileNumber,
    isArvUser,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(200).json({ user: createdUser.toObject({ getters: true }) });
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

  res.json({ message: "Logged In" });
};

export { signup, login };
