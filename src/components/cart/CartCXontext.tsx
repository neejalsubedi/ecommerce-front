import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { ProductType } from "../types/ProductType";

interface CartItem extends ProductType {
  quantity: number;
  stock:number
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: ProductType) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: ProductType) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        return prev.map((p) =>
          p._id === item._id ? { ...p,stock:stock, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);

 const increaseQuantity = (id: string) => {
  setCartItems((prev) =>
    prev.map((item) => {
      if (item._id === id) {
        const newQuantity = Math.min(Number(item.quantity) + 1, 10);
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
  );
};


  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };
  const removeFromCart = (id: string) => {
  setCartItems((prev) => prev.filter((item) => item._id !== id));
};


  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, clearCart, increaseQuantity, decreaseQuantity,removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
