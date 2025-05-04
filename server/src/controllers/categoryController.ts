import { Request, Response } from "express";
import { Category } from "../models/categoryModel";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, imageUrl } = req.body as { name: string; imageUrl?: string };

    const existing = await Category.findOne({ name });
    if (existing) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }

    const newCategory = new Category({ name, imageUrl });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};
