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
  storeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Store",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  placedAt: {
    type: Date,
  },
  processedAt: {
    type: Date,
  },
  shippedAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
  },
});

orderItemSchema.plugin(uniqueValidator);

export default mongoose.model("OrderItem", orderItemSchema);
