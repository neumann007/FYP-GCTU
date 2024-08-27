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
import fileUpload from "../middleware/file-upload.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

// router.use(checkAuth);

router.get("/:pid", getProductById);

router.get("/store/:sid", getProductsByStoreId);

router.get("/", getAllProducts);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("brand").not().isEmpty(),
    check("price").not().isEmpty(),
    check("category").not().isEmpty(),
    check("description").isLength({ min: 10 }),
    check("storeId").not().isEmpty(),
    check("stock").not().isEmpty(),
    check("isArvDrug").not().isEmpty(),
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
    check("storeId").not().isEmpty(),
    check("stock").not().isEmpty(),
  ],
  updateProduct
);

router.delete("/:pid", deleteProduct);

export default router;
