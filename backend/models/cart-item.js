import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import product from "./product";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
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
  productName: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
});

cartItemSchema.plugin(uniqueValidator);

export default mongoose.model("CartItem", cartItemSchema);
