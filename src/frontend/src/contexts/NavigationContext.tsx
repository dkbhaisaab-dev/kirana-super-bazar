import type React from "react";
import { createContext, useContext, useState } from "react";

export type Page = "home" | "checkout" | "orders" | "admin" | "profile";

interface NavigationContextType {
  page: Page;
  navigate: (page: Page) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({
  children,
}: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = (newPage: Page) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavigationContext.Provider
      value={{ page, navigate, searchTerm, setSearchTerm }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
