import HttpError from "../models/http-error.js";
import Cart from "../models/cart.js";
import CartItem from "../models/cart-item.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import OrderItem from "../models/order-item.js";
import Product from "../models/product.js";

const createOrder = async (req, res, next) => {
  const { userId, orderNumber, totalPrice, deliveryAddress, details } =
    req.body;

  const newOrder = new CartItem({
    userId,
    orderNumber,
    totalPrice,
    deliveryAddress,
    details,
    deliveryStatus: "PENDING",
  });

  try {
    await newOrder.save();
  } catch (err) {
    return next(err.message);
  }

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

  let newOrderItemsList = [];
  if (!cartItems || cartItems.length === 0) {
    return next(
      new HttpError("Could not find cart items for the provided Id", 404)
    );
  } else {
    cartItems.forEach(async (item) => {
      try {
        let product;
        try {
          product = await Product.findById(item.productId);
        } catch (err) {
          throw err;
        }

        const newOrderItem = new OrderItem({
          orderId: newOrder._id,
          productId: item.productId,
          storeId: product.storeId,
          totalPrice: item.totalPrice,
          totalQuantity: item.totalQuantity,
          placedAt: new Date(),
          orderStatus: "PENDING",
        });

        try {
          await newOrderItem.save();
          newOrderItemsList.push(newOrderItem);
        } catch (err) {
          throw err;
        }
      } catch (error) {
        console.log(error);
      }
    });

    //Deleting all cart items after order placement
    try {
      await CartItem.deleteMany({ cartId: cart._id });
    } catch (error) {
      console.log(error);
    }
  }

  res.status(201).json({
    order: newOrder.toObject({ getters: true }),
    orderItems: newOrderItemsList.map((items) =>
      items.toObject({ getters: true })
    ),
  });
};

const getOrderItemById = async (req, res, next) => {
  const orderItemId = req.params.itemid;
  let orderItem;
  try {
    orderItem = await OrderItem.findById(orderItemId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the order item",
      500
    );
    return next(error);
  }

  let order;
  try {
    order = await Order.findOne({ orderId: orderItem.orderId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user cart",
      500
    );
    return next(error);
  }

  if (!orderItem) {
    const error = new HttpError(
      "Could not find a order item for the provided Id",
      404
    );
    return next(error);
  } else {
    res.json({
      orderItem: orderItem.toObject({ getters: true }),
      orderInfo: order.toObject({ getters: true }),
    });
  }
};

const getOrdersByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let orders;
  try {
    orders = await Order.find({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed, please try again",
      500
    );
    return next(error);
  }

  if (!orders || orders.length === 0) {
    return next(
      new HttpError("Could not find orders for the provided Id", 404)
    );
  } else {
    res.json({
      userOrders: orders.map((items) => items.toObject({ getters: true })),
    });
  }
};

const getOrderItemsByStoreId = async (req, res, next) => {
  const storeId = req.params.sid;

  let orderItems;
  try {
    orderItems = await OrderItem.find({ storeId: storeId });
  } catch (err) {
    const error = new HttpError(
      "Fetching product failed, please try again",
      500
    );
    return next(error);
  }

  if (!orderItems || orderItems.length === 0) {
    return next(
      new HttpError("Could not find order items for the provided Id", 404)
    );
  } else {
    res.json({
      storeOrders: orderItems.map((items) => items.toObject({ getters: true })),
    });
  }
};

const getOrderItemsByOrderId = async (req, res, next) => {
  const orderId = req.params.oid;

  const userId = req.params.uid;
  let order;
  try {
    order = await Order.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user cart",
      500
    );
    return next(error);
  }

  let ordertItems;
  try {
    ordertItems = await OrderItem.find({ orderId: orderId });
  } catch (err) {
    const error = new HttpError(
      "Fetching product failed, please try again",
      500
    );
    return next(error);
  }

  if (!ordertItems || ordertItems.length === 0) {
    return next(
      new HttpError("Could not find cart items for the provided Id", 404)
    );
  } else {
    res.json({
      orderItems: ordertItems.map((items) => items.toObject({ getters: true })),
      orderInfo: order.toObject({ getters: true }),
    });
  }
};

const updateOrderItem = async (req, res, next) => {
  const orderItemId = req.params.oid;
  const { action } = req.body;

  let orderItem;
  try {
    orderItem = await OrderItem.findById(orderItemId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }

  if (action === "process") {
    orderItem.processedAt = new Date();
    orderItem.orderStatus = "PROCESSED";
  } else if (action === "shipped") {
    orderItem.processedAt = new Date();
    orderItem.orderStatus = "SHIPPED";
  } else if (action === "delivered") {
    orderItem.processedAt = new Date();
    orderItem.orderStatus = "DELIVERED";
  }
  try {
    await orderItem.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product",
      500
    );
    return next(error);
  }
  res.status(200).json({ orderItem: orderItem.toObject({ getters: true }) });
};

export {
  createOrder,
  getOrderItemById,
  getOrdersByUserId,
  getOrderItemsByStoreId,
  getOrderItemsByOrderId,
  updateOrderItem,
};
