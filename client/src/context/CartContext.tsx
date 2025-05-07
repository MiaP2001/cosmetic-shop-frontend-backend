import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { Product } from "../types/productTypes";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type State = CartItem[];

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "CHANGE_QUANTITY"; payload: { id: string; quantity: number } };

const initialState: State = [];

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        return [...state, action.payload];
      }
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR_CART":
      return [];
    case "CHANGE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    default:
      return state;
  }
}

const CartContext = createContext<{
  cart: State;
  dispatch: React.Dispatch<Action>;
}>({
  cart: initialState,
  dispatch: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const { dispatch } = context;

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const products = res.data.products;

      dispatch({ type: "CLEAR_CART" });

      products.forEach((item: { product: Product; quantity: number }) => {
        if (!item.product._id) return;

        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          },
        });
      });
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  return { ...context, fetchCart };
};
