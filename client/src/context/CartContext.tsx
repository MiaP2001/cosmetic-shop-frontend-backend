import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
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

export const useCart = () => useContext(CartContext);
