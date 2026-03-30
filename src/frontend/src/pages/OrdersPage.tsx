import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronDown, Package } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigation } from "../contexts/NavigationContext";
import { OrderStatus, useGetMyOrders } from "../hooks/useQueries";
import { getCategoryEmoji } from "../utils/categoryEmoji";

const STATUS_CONFIG: Record<
  string,
  { label: string; hindi: string; color: string }
> = {
  [OrderStatus.pending]: {
    label: "Pending",
    hindi: "प्रतीक्षारत",
    color: "bg-yellow-100 text-yellow-800",
  },
  [OrderStatus.confirmed]: {
    label: "Confirmed",
    hindi: "स्वीकृत",
    color: "bg-blue-100 text-blue-800",
  },
  [OrderStatus.outForDelivery]: {
    label: "Out for Delivery",
    hindi: "डिलीवरी पर",
    color: "bg-orange-100 text-orange-800",
  },
  [OrderStatus.delivered]: {
    label: "Delivered",
    hindi: "डिलीवर",
    color: "bg-green-100 text-green-800",
  },
  [OrderStatus.cancelled]: {
    label: "Cancelled",
    hindi: "रद्द",
    color: "bg-red-100 text-red-800",
  },
};

const SKELETON_KEYS = ["ord-sk1", "ord-sk2", "ord-sk3"];

export default function OrdersPage() {
  const { navigate } = useNavigation();
  const { data: orders, isLoading } = useGetMyOrders();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sortedOrders = [...(orders ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        type="button"
        data-ocid="orders.back_button"
        onClick={() => navigate("home")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shopping
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">मेरे ऑर्डर</h1>
        <p className="text-muted-foreground text-sm">My Orders</p>
      </div>

      {isLoading ? (
        <div data-ocid="orders.loading_state" className="space-y-3">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <div data-ocid="orders.empty_state" className="text-center py-20">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-bold text-lg">कोई ऑर्डर नहीं</p>
          <p className="text-muted-foreground text-sm mb-6">No orders yet</p>
          <button
            type="button"
            data-ocid="orders.shop_now_button"
            onClick={() => navigate("home")}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-2xl text-sm hover:bg-primary/90 transition-colors"
          >
            अभी खरीदें / Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOrders.map((order, idx) => {
            const statusConfig = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              hindi: "",
              color: "bg-muted text-foreground",
            };
            const isExpanded = expanded === order.id.toString();
            const date = new Date(Number(order.createdAt) / 1_000_000);

            return (
              <motion.div
                key={order.id.toString()}
                data-ocid={`orders.item.${idx + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl shadow-card overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() =>
                    setExpanded(isExpanded ? null : order.id.toString())
                  }
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">
                        Order #{order.id.toString()}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusConfig.color}`}
                      >
                        {statusConfig.hindi || statusConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.items.length} items · ₹
                      {(Number(order.total) / 100).toFixed(0)} ·{" "}
                      {date.toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        <div className="space-y-2 mb-3">
                          {order.items.map((item) => (
                            <div
                              key={item.productId.toString()}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-base">
                                {getCategoryEmoji("")}
                              </span>
                              <span className="flex-1">
                                Product #{item.productId.toString()}
                              </span>
                              <span className="text-muted-foreground">
                                ×{item.quantity.toString()}
                              </span>
                              <span className="font-semibold">
                                ₹{(Number(item.price) / 100).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          📍 {order.deliveryAddress}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
