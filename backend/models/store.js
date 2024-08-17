import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  storeName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  region: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  storeAddress: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  accType: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  ],
});

storeSchema.plugin(uniqueValidator);

export default mongoose.model("Store", storeSchema);
