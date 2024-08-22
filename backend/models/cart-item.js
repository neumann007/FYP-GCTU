import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    cartId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Cart",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

cartItemSchema.plugin(uniqueValidator);

export default mongoose.model("CartItem", cartItemSchema);
