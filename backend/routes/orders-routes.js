import express from "express";

import {
  getOrdersByUserId,
  getOrderItemsByStoreId,
  getOrderItemsByOrderId,
  getOrderItemById,
  createOrder,
  updateOrderItem,
} from "../controllers/order-controllers.js";

const router = express.Router();

router.get("/:uid", getOrdersByUserId);

router.get("/:sid", getOrderItemsByStoreId);

router.get("/items/:oid", getOrderItemsByOrderId);

router.get("/item/:itemid", getOrderItemById);

router.post("/", createOrder);

router.patch("/:oid", updateOrderItem);

// router.delete("/:oid", deleteOrderItem);

export default router;
