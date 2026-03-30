import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../backend";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, delta: number) => void;
  clearCart: () => void;
  totalPaise: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = "kirana-cart";

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      quantity: item.quantity,
      product: {
        ...item.product,
        id: item.product.id.toString(),
        price: item.product.price.toString(),
        stock: item.product.stock.toString(),
      },
    })),
  );
}

function deserializeCart(json: string): CartItem[] {
  try {
    const raw = JSON.parse(json);
    return raw.map((item: any) => ({
      quantity: item.quantity,
      product: {
        ...item.product,
        id: BigInt(item.product.id),
        price: BigInt(item.product.price),
        stock: BigInt(item.product.stock),
      },
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? deserializeCart(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, serializeCart(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: bigint, delta: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.product.id !== productId) return [i];
        const newQty = i.quantity + delta;
        if (newQty <= 0) return [];
        return [{ ...i, quantity: newQty }];
      }),
    );
  };

  const clearCart = () => setItems([]);

  const totalPaise = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0,
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPaise,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
