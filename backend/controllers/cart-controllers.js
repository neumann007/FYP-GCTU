import HttpError from "../models/http-error.js";
import Product from "../models/product.js";
import CartItem from "../models/cart-item.js";
import Cart from "../models/cart.js";

const addCartItem = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  let shoppingSession;
  try {
    shoppingSession = await Cart.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  if (!shoppingSession) {
    const error = new HttpError(
      "Could not find user cart for provided ID",
      404
    );
    return next(error);
  }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided Id",
      404
    );
    return next(error);
  }

  let existingItem;
  try {
    existingItem = await CartItem.findOne({
      cartId: shoppingSession._id,
      productId: productId,
    });
  } catch (err) {
    const error = new HttpError("Server error, please try again", 500);
    return next(error);
  }

  if (existingItem) {
    const error = new HttpError(
      "Item exists already in cart, please adjust quantity instead",
      422
    );
    return next(error);
  }

  const newCartItem = new CartItem({
    cartId: shoppingSession._id,
    productId: productId,
    totalQuantity: quantity,
    totalPrice: quantity * product.price,
  });

  try {
    await newCartItem.save();
  } catch (err) {
    return next(err.message);
  }
  res.status(201).json({
    newItem: newCartItem.toObject({ getters: true }),
    productDetails: product,
  });
};

const getCartItemsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let cart;
  try {
    cart = await Cart.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user cart",
      500
    );
    return next(error);
  }

  let cartItems;
  try {
    cartItems = await CartItem.find({ cartId: cart._id });
  } catch (err) {
    const error = new HttpError(
      "Fetching product failed, please try again",
      500
    );
    return next(error);
  }

  if (!cartItems || cartItems.length === 0) {
    return next(
      new HttpError("Could not find cart items for the provided Id", 404)
    );
  } else {
    res.json({
      cartItems: cartItems.map((items) => items.toObject({ getters: true })),
    });
  }
};

const checkCartForProduct = async (req, res, next) => {
  const productId = req.params.pid;
  const userId = req.params.uid;

  let shoppingSession;
  try {
    shoppingSession = await Cart.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  let existingItem;
  try {
    existingItem = await CartItem.findOne({
      cartId: shoppingSession._id,
      productId: productId,
    });
  } catch (err) {
    const error = new HttpError("Server error, please try again", 500);
    return next(error);
  }

  if (existingItem) {
    res.json({
      cartProduct: existingItem.toObject({ getters: true }),
    });
  }
};

const updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;
  const itemId = req.params.cid;

  let cartItem;
  try {
    cartItem = await Cart.findById(itemId);
  } catch (err) {
    const error = new HttpError("Server Error, could not find cart item", 500);
    return next(error);
  }

  let product;
  try {
    product = await Product.findById(cartItem.productId);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided Id",
      404
    );
    return next(error);
  }

  cartItem.totalQuantity = quantity;
  cartItem.totalPrice = product.price;

  try {
    await cartItem.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }
  res.status(200).json({ cartItem: cartItem.toObject({ getters: true }) });
};

const deleteCartItem = async (req, res, next) => {
  const itemId = req.params.cid;
  let cartItem;
  try {
    await CartItem.findById(itemId).populate("cartId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product",
      500
    );
    return next(error);
  }

  if (!cartItem) {
    const error = new HttpError("Could not find cart item for this Id", 404);
    return next(error);
  }

  try {
    await cartItem.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove cart item",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted Successfully." });
};

export {
  addCartItem,
  getCartItemsByUserId,
  checkCartForProduct,
  updateCartItem,
  deleteCartItem,
};
