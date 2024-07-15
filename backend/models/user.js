import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  isArvUser: {
    type: Boolean,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
