import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategoryById,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);
router.get("/:id", getCategoryById);

export default router;
