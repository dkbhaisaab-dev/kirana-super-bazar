import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getCategoryEmoji } from "../utils/categoryEmoji";

const DELIVERY_CHARGE = 3000; // paise = ₹30
const FREE_DELIVERY_THRESHOLD = 50000; // paise = ₹500

export default function CartSidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPaise,
    itemCount,
    isOpen,
    setIsOpen,
  } = useCart();
  const { navigate } = useNavigation();
  const { identity } = useInternetIdentity();

  const deliveryCharge =
    totalPaise >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal = totalPaise + deliveryCharge;

  const handleCheckout = () => {
    if (!identity) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    navigate("checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            data-ocid="cart.panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-bold text-lg text-foreground">
                  आपकी टोकरी
                </h2>
                <p className="text-xs text-muted-foreground">
                  {itemCount} items
                </p>
              </div>
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1">
              {items.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground"
                >
                  <ShoppingBag className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-medium">टोकरी खाली है</p>
                  <p className="text-xs">Your cart is empty</p>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.product.id.toString()}
                      data-ocid={`cart.item.${idx + 1}`}
                      className="flex items-center gap-3 bg-muted/40 rounded-2xl p-3"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-xs shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          getCategoryEmoji(item.product.category)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.product.nameHindi}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ₹{(Number(item.product.price) / 100).toFixed(0)}
                          <span className="text-xs font-normal text-muted-foreground">
                            /{item.product.unit}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-ocid={`cart.decrease_button.${idx + 1}`}
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          data-ocid={`cart.increase_button.${idx + 1}`}
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                        <button
                          type="button"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                          onClick={() => removeItem(item.product.id)}
                          className="w-7 h-7 ml-1 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ₹{(totalPaise / 100).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={
                        deliveryCharge === 0
                          ? "text-primary font-medium"
                          : "font-medium"
                      }
                    >
                      {deliveryCharge === 0
                        ? "FREE 🎉"
                        : `₹${(deliveryCharge / 100).toFixed(0)}`}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ₹
                      {((FREE_DELIVERY_THRESHOLD - totalPaise) / 100).toFixed(
                        0,
                      )}{" "}
                      more for free delivery!
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(grandTotal / 100).toFixed(0)}
                    </span>
                  </div>
                </div>
                <Button
                  data-ocid="cart.checkout_button"
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-12 text-base"
                >
                  {!identity ? "Login to Checkout" : "Checkout →"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
