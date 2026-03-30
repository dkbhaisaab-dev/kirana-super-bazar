import { Toaster } from "@/components/ui/sonner";
import CartSidebar from "./components/CartSidebar";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { CartProvider } from "./contexts/CartContext";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

function AppContent() {
  const { page } = useNavigation();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isAdmin={!!isAdmin} />
      <CartSidebar />
      {showProfileSetup && <ProfileSetupModal />}
      <main className="flex-1">
        {page === "home" && <HomePage />}
        {page === "checkout" && <CheckoutPage />}
        {page === "orders" && <OrdersPage />}
        {page === "admin" && isAdmin && <AdminPage />}
        {page === "admin" && !isAdmin && (
          <div className="container py-20 text-center">
            <p className="text-muted-foreground text-lg">
              Access denied. Admin only.
            </p>
          </div>
        )}
        {page === "profile" && <ProfilePage />}
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NavigationProvider>
  );
}
