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
  const { storeName, email, password, location, telephone } = req.body;

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

  const createdStore = new Store({
    storeName,
    email,
    username,
    password,
    location,
    telephone,
    products: [],
  });

  try {
    await createdStore.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(200).json({ store: createdStore.toObject({ getters: true }) });
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

  if (!existingStore || existingStore.password !== password) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in. Check email and password again",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged In" });
};

export { signup, login };
