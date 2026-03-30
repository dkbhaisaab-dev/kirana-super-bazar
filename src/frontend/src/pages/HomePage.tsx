import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Shield, ShoppingBag, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useGetProducts } from "../hooks/useQueries";
import { CATEGORIES } from "../utils/categoryEmoji";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    hindi: "तेज़ डिलीवरी",
    desc: "Same day delivery available",
    colorClass: "card-green",
  },
  {
    icon: Shield,
    title: "Fresh Quality",
    hindi: "ताज़ा गुणवत्ता",
    desc: "Guaranteed fresh products",
    colorClass: "card-orange",
  },
  {
    icon: Clock,
    title: "Open 24/7",
    hindi: "24/7 खुला",
    desc: "Shop anytime, anywhere",
    colorClass: "card-blue",
  },
  {
    icon: ShoppingBag,
    title: "Best Prices",
    hindi: "सबसे कम दाम",
    desc: "Unbeatable grocery deals",
    colorClass: "card-teal",
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function HomePage() {
  const { searchTerm, setSearchTerm } = useNavigation();
  const { setIsOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: products, isLoading } = useGetProducts();

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.nameHindi.includes(term) ||
          p.category.toLowerCase().includes(term),
      );
    }
    return result;
  }, [products, activeCategory, searchTerm]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-white/80 font-semibold text-sm mb-2 tracking-wide uppercase">
                🌿 आपका किराना स्टोर
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                ताजा सामान,
              </h1>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                घर पर डिलीवरी
              </h1>
              <p className="text-xl text-white/90 font-medium mb-8">
                Fresh Groceries, Delivered Daily
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  data-ocid="hero.shop_now_button"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white text-primary font-bold px-8 h-12 rounded-2xl hover:bg-white/90 shadow-hero text-base"
                >
                  अभी खरीदें / Shop Now
                </Button>
                <Button
                  data-ocid="hero.cart_button"
                  onClick={() => setIsOpen(true)}
                  variant="outline"
                  className="bg-white/20 border-white/40 text-white font-bold px-8 h-12 rounded-2xl hover:bg-white/30 text-base"
                >
                  View Cart 🛒
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-10 bottom-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 -mt-8 mb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`${f.colorClass} rounded-2xl p-4 text-white shadow-card`}
            >
              <f.icon className="w-6 h-6 mb-2 opacity-90" />
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs opacity-80">{f.hindi}</div>
              <div className="text-xs opacity-70 mt-1">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-foreground mb-1">
            हमारे उत्पाद
          </h2>
          <p className="text-muted-foreground text-sm">Our Products</p>
        </div>

        {/* Category Pills */}
        <div
          data-ocid="products.filter.tab"
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              data-ocid="category.tab"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-foreground hover:bg-muted border border-border"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.hindi}</span>
            </button>
          ))}
        </div>

        {/* Search status */}
        {searchTerm && (
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-muted-foreground">
              Results for:{" "}
              <span className="font-semibold text-foreground">
                "{searchTerm}"
              </span>
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-xs text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div
            data-ocid="products.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="products.empty_state" className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="font-bold text-lg text-foreground">
              कोई उत्पाद नहीं मिला
            </p>
            <p className="text-muted-foreground text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
