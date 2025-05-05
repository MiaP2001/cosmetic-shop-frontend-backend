import { Request, Response } from "express";
import { Order } from "../models/orderModel";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { products, total } = req.body;

    const order = new Order({ user: userId, products, total });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate(
      "products.product"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};
