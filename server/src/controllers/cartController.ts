import { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(403).json({ message: "User not authenticated" });
      return;
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.products.find((p) => p.product.toString() === productId);

    if (!item) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const index = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    cart.products.splice(index, 1);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing cart item", error });
  }
};
