import express, { Request } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";
import { authenticateUser } from "../middleware/authMiddleware";
import { checkAdminOrOwner } from "../middleware/roleMiddleware";
import { getOwnerIdFromParams } from "../utils/getOwnerIdFromParams";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.delete(
  "/:id",
  authenticateUser,
  checkAdminOrOwner(getOwnerIdFromParams),
  deleteProduct
);

router.put(
  "/:id",
  authenticateUser,
  checkAdminOrOwner(getOwnerIdFromParams),
  updateProduct
);

export default router;
