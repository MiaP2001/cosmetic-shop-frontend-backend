import type { Category } from "./types/Category";

export type Product = {
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  instruction?: string;
  brand?: string;
  category: string | Category;
};
