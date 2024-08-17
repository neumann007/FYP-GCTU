import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: [
    {
      placed: [
        {
          status: {
            type: String,
          },
          date: {
            type: Date,
          },
        },
      ],
      processed: [
        {
          status: {
            type: String,
          },
          date: {
            type: Date,
          },
        },
      ],
      shipped: [
        {
          status: {
            type: String,
          },
          date: {
            type: Date,
          },
        },
      ],
      delivered: [
        {
          status: {
            type: String,
          },
          date: {
            type: Date,
          },
        },
      ],
    },
  ],
  orderItems: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "OrderItem",
    },
  ],
});

cartSchema.plugin(uniqueValidator);

export default mongoose.model("Order", orderSchema);
