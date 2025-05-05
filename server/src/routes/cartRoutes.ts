import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, addToCart);
router.get("/", authenticateUser, getCart);
router.put("/:productId", authenticateUser, updateCartItem);
router.delete("/:productId", authenticateUser, removeCartItem);

export default router;
