import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  cartItems: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "CartItem",
    },
  ],
});

cartSchema.plugin(uniqueValidator);

export default mongoose.model("Cart", cartSchema);
