import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

type Action = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

const initialState: User = null;

function userReducer(state: User, action: Action): User {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
}

const UserContext = createContext<
  | {
      user: User;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
