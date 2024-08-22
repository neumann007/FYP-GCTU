import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    itemsCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.plugin(uniqueValidator);

export default mongoose.model("Cart", cartSchema);
