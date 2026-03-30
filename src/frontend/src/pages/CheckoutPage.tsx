import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Loader2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useGetCallerUserProfile, usePlaceOrder } from "../hooks/useQueries";
import { getCategoryEmoji } from "../utils/categoryEmoji";

export default function CheckoutPage() {
  const { navigate } = useNavigation();
  const { items, totalPaise, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const { data: profile } = useGetCallerUserProfile();

  const [form, setForm] = useState({
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    pincode: "",
  });
  const [ordered, setOrdered] = useState(false);

  const deliveryCharge = totalPaise >= 50000 ? 0 : 3000;
  const grandTotal = totalPaise + deliveryCharge;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const fullAddress = `${form.name}, ${form.phone}\n${form.address}${form.pincode ? `, ${form.pincode}` : ""}`;
    try {
      await placeOrder.mutateAsync({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: BigInt(i.quantity),
        })),
        address: fullAddress,
      });
      clearCart();
      setOrdered(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (ordered) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm mx-auto"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            ऑर्डर हो गया! 🎉
          </h2>
          <p className="text-muted-foreground mb-8">
            Order placed successfully!
          </p>
          <Button
            data-ocid="checkout.view_orders_button"
            onClick={() => navigate("orders")}
            className="bg-primary text-white font-bold rounded-2xl px-8 h-12"
          >
            मेरे ऑर्डर देखें / View My Orders
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button
        type="button"
        data-ocid="checkout.back_button"
        onClick={() => navigate("home")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shopping
      </button>

      <h1 className="text-2xl font-extrabold text-foreground mb-6">
        <MapPin className="inline w-6 h-6 text-primary mr-2" />
        डिलीवरी पता / Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-base text-foreground">
            Delivery Information
          </h3>
          <div className="space-y-1">
            <Label htmlFor="co-name" className="text-sm font-semibold">
              नाम / Full Name *
            </Label>
            <Input
              id="co-name"
              data-ocid="checkout.name_input"
              placeholder="Rajesh Kumar"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="co-phone" className="text-sm font-semibold">
              फोन / Phone *
            </Label>
            <Input
              id="co-phone"
              data-ocid="checkout.phone_input"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="co-address" className="text-sm font-semibold">
              पूरा पता / Full Address *
            </Label>
            <Textarea
              id="co-address"
              data-ocid="checkout.address_textarea"
              placeholder="House No., Street, Area, City"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="co-pincode" className="text-sm font-semibold">
              पिन कोड / Pincode
            </Label>
            <Input
              id="co-pincode"
              data-ocid="checkout.pincode_input"
              placeholder="110001"
              value={form.pincode}
              onChange={(e) =>
                setForm((f) => ({ ...f, pincode: e.target.value }))
              }
              className="rounded-xl"
              maxLength={6}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="font-bold text-base text-foreground mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-xl shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                    ) : (
                      getCategoryEmoji(item.product.category)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    ₹
                    {(
                      (Number(item.product.price) * item.quantity) /
                      100
                    ).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="mb-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(totalPaise / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span
                  className={
                    deliveryCharge === 0 ? "text-primary font-medium" : ""
                  }
                >
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${(deliveryCharge / 100).toFixed(0)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-extrabold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  ₹{(grandTotal / 100).toFixed(0)}
                </span>
              </div>
            </div>
            <Button
              data-ocid="checkout.place_order_button"
              onClick={handleSubmit}
              disabled={placeOrder.isPending || items.length === 0}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-12 text-base"
            >
              {placeOrder.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              ऑर्डर करें / Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
