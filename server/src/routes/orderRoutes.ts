import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getMyOrders);

export default router;
