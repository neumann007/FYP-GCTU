import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  storeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Store",
  },
  stock: {
    type: Number,
    required: true,
  },
  isArvDrug: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
