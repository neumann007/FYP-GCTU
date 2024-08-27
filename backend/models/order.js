import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(uniqueValidator);

export default mongoose.model("Order", orderSchema);
