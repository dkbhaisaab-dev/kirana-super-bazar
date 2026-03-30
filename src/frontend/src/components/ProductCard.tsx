import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { useCart } from "../contexts/CartContext";
import { getCategoryEmoji } from "../utils/categoryEmoji";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, items, setIsOpen } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const priceRs = Number(product.price) / 100;

  const handleAdd = () => {
    addItem(product);
    setIsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-card rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
    >
      {/* Product image/emoji area */}
      <div className="relative bg-gradient-to-br from-muted to-muted/60 h-40 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl select-none">
            {getCategoryEmoji(product.category)}
          </span>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-1">
          <h3 className="font-bold text-sm text-foreground leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">{product.nameHindi}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-lg text-primary">
              ₹{priceRs.toFixed(0)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              /{product.unit}
            </span>
          </div>
          <Button
            data-ocid="product.add_button"
            onClick={handleAdd}
            disabled={!product.isAvailable}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-8 gap-1 text-xs font-bold"
          >
            {cartItem ? (
              <>
                <ShoppingCart className="w-3 h-3" />
                {cartItem.quantity}
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
