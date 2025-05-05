import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { checkAdminOnly } from "../middleware/roleMiddleware";

import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategoryById,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/", authenticateUser, checkAdminOnly(), createCategory);
router.delete("/:id", authenticateUser, checkAdminOnly(), deleteCategory);
router.put("/:id", authenticateUser, checkAdminOnly(), updateCategory);

router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
