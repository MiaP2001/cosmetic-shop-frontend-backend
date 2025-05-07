import type { Category } from "./Category";

export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  instruction?: string;
  brand?: string;
  category: string | Category;
};

export type ProductInCart = {
  product: Product;
  quantity: number;
};
