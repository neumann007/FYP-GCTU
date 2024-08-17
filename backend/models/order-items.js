import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import product from "./product";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  orderId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Order",
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

orderItemSchema.plugin(uniqueValidator);

export default mongoose.model("OrderItem", orderItemSchema);
