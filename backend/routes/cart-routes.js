import express from "express";

import {
  addCartItem,
  checkCartForProduct,
  deleteCartItem,
  getCartItemsByUserId,
  updateCartItem,
} from "../controllers/cart-controllers.js";

const router = express.Router();

router.get("/:uid", getCartItemsByUserId);

router.get("/:pid/:uid", checkCartForProduct);

router.post("/", addCartItem);

router.patch("/:cid", updateCartItem);

router.delete("/:cid", deleteCartItem);

export default router;
