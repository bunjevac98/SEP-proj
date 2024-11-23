"use client";
import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { cartItem } from "lib/lib/objects";
import { Cookies } from "react-cookie";

interface CartState {
  items: cartItem[];
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; item: cartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" };

interface CartContextProps {
  state: CartState;
  addItem: (item: cartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const calculateTotalPrice = (items: cartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.item.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.item];
      }
      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.id);
      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }
    case "UPDATE_QUANTITY": {
      let updatedItems;
      if (action.quantity === 0) {
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        updatedItems = state.items.map((item) =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        );
      }
      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalPrice: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cookie = new Cookies;
  const initialCart = cookie.get('cart') || { items: [], totalPrice: 0 };
  const [state, dispatch] = useReducer(cartReducer, initialCart); 


  useEffect(() => {
    // Save cart to cookie whenever it changes
    cookie.set('cart', state, { path: '/' });
  }, [state, cookie]);

  const addItem = (item: cartItem) => {
    dispatch({ type: "ADD_ITEM", item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
