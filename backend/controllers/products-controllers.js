import { validationResult } from "express-validator";
import fs from "fs";

import HttpError from "../models/http-error.js";
import Product from "../models/product.js";
import Store from "../models/store.js";

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the product",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided Id",
      404
    );
    return next(error);
  } else {
    res.json({ product: product.toObject({ getters: true }) });
  }
};

const getProductsByStoreId = async (req, res, next) => {
  const storeId = req.params.sid;
  let products;
  try {
    products = await Product.find({ storeId: storeId });
  } catch (err) {
    const error = new HttpError(
      "Fetching product failed, please try again",
      500
    );
    return next(error);
  }

  if (!products || products.length === 0) {
    return next(
      new HttpError("Could not find a product for the provided Id", 404)
    );
  } else {
    res.json({
      products: products.map((product) => product.toObject({ getters: true })),
    });
  }
};

const getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching Products failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const {
    title,
    brand,
    price,
    category,
    description,
    storeId,
    stock,
    isArvDrug,
  } = req.body;

  // if (product.storeId.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to create a product",
  //     401
  //   );
  //   return next(error);
  // }

  const createdProduct = new Product({
    title,
    image: req.file.path,
    brand,
    price,
    category,
    description,
    storeId,
    stock,
    isArvDrug,
  });

  let store;
  try {
    store = await Store.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  if (!store) {
    const error = new HttpError("Could not find user for provided ID", 404);
    return next(error);
  }

  try {
    await createdProduct.save();
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({ product: createdProduct.toObject({ getters: true }) });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, brand, price, category, description, stock } = req.body;
  const productId = req.params.pid;

  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }

  if (product.storeId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this product",
      401
    );
    return next(error);
  }

  product.name = name;
  product.brand = brand;
  product.price = price;
  product.category = category;
  product.description = description;
  product.stock = stock;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }
  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    await Product.findById(productId).populate("storeId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find product for this Id", 404);
    return next(error);
  }

  if (product.storeId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this product",
      401
    );
    return next(error);
  }

  const imagePath = product.image;

  try {
    await product.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted Successfully." });
};

export {
  getProductById,
  getProductsByStoreId,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
