import express from "express";
import { check } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByStoreId,
  updateProduct,
} from "../controllers/products-controllers.js";

const router = express.Router();

router.get("/:pid", getProductById);

router.get("/store/:sid", getProductsByStoreId);

router.get("/", getAllProducts);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("category").not().isEmpty(),
    check("description").isLength({ min: 10 }),
    check("brand").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  createProduct
);

router.patch(
  "/:pid",
  [
    check("name").not().isEmpty(),
    check("category").not().isEmpty(),
    check("description").isLength({ min: 10 }),
    check("brand").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  updateProduct
);

router.delete("/:pid", deleteProduct);

export default router;
