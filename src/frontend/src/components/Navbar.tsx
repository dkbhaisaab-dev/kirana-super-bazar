import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Search, ShoppingCart, Store, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  isAdmin: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const { itemCount, setIsOpen } = useCart();
  const { navigate, page, searchTerm, setSearchTerm } = useNavigation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <nav className="container mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-sm text-foreground">
              Kirana Super Bazar
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              किराना सुपर बाजार
            </div>
          </div>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="nav.search_input"
            placeholder="खोजें / Search products..."
            className="pl-9 bg-muted border-0 rounded-full text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (page !== "home") navigate("home");
            }}
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <button
              type="button"
              data-ocid="nav.orders_link"
              onClick={() => navigate("orders")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === "orders"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              मेरे ऑर्डर
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.admin_link"
              onClick={() => navigate("admin")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === "admin"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              Admin
            </button>
          )}
        </div>

        {/* Cart + Auth */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-ocid="nav.cart_button"
            onClick={() => setIsOpen(true)}
            className="relative p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
                {itemCount}
              </Badge>
            )}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              data-ocid="nav.profile_button"
              onClick={() => navigate("profile")}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          ) : null}

          <Button
            data-ocid="nav.login_button"
            onClick={handleAuth}
            disabled={loginStatus === "logging-in"}
            size="sm"
            className={`rounded-full text-sm font-semibold ${
              isAuthenticated
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {loginStatus === "logging-in"
              ? "..."
              : isAuthenticated
                ? "Logout"
                : "Login"}
          </Button>

          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden p-2 hover:bg-muted rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          {isAuthenticated && (
            <button
              type="button"
              data-ocid="nav.orders_link"
              onClick={() => {
                navigate("orders");
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              मेरे ऑर्डर / My Orders
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.admin_link"
              onClick={() => {
                navigate("admin");
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              Admin Panel
            </button>
          )}
        </div>
      )}
    </header>
  );
}
