import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductInput } from "../backend";
import {
  OrderStatus,
  useAddProduct,
  useDeleteProduct,
  useGetAllOrders,
  useGetProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";
import { CATEGORIES, getCategoryEmoji } from "../utils/categoryEmoji";

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.confirmed]: "Confirmed",
  [OrderStatus.outForDelivery]: "Out for Delivery",
  [OrderStatus.delivered]: "Delivered",
  [OrderStatus.cancelled]: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.confirmed]: "bg-blue-100 text-blue-800",
  [OrderStatus.outForDelivery]: "bg-orange-100 text-orange-800",
  [OrderStatus.delivered]: "bg-green-100 text-green-800",
  [OrderStatus.cancelled]: "bg-red-100 text-red-800",
};

const EMPTY_FORM: ProductInput = {
  name: "",
  nameHindi: "",
  description: "",
  category: "Grains",
  price: 0n,
  unit: "kg",
  stock: 0n,
  imageUrl: "",
};

export default function AdminPage() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [productDialog, setProductDialog] = useState<"add" | "edit" | null>(
    null,
  );
  const [editId, setEditId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [priceStr, setPriceStr] = useState("");
  const [stockStr, setStockStr] = useState("");

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setPriceStr("");
    setStockStr("");
    setEditId(null);
    setProductDialog("add");
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name,
      nameHindi: p.nameHindi,
      description: p.description,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      imageUrl: p.imageUrl,
    });
    setPriceStr((Number(p.price) / 100).toFixed(2));
    setStockStr(p.stock.toString());
    setEditId(p.id);
    setProductDialog("edit");
  };

  const handleSave = async () => {
    const priceVal = Math.round(Number.parseFloat(priceStr) * 100);
    const stockVal = Number.parseInt(stockStr, 10);
    if (!form.name.trim() || Number.isNaN(priceVal) || Number.isNaN(stockVal)) {
      toast.error("Please fill all required fields.");
      return;
    }
    const input: ProductInput = {
      ...form,
      price: BigInt(priceVal),
      stock: BigInt(stockVal),
    };
    try {
      if (productDialog === "edit" && editId !== null) {
        await updateProduct.mutateAsync({ id: editId, input });
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync(input);
        toast.success("Product added!");
      }
      setProductDialog(null);
    } catch {
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        orderId,
        status: status as OrderStatus,
      });
      toast.success("Status updated!");
    } catch {
      toast.error("Update failed.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Manage products and orders
        </p>

        <Tabs data-ocid="admin.tab" defaultValue="products">
          <TabsList className="mb-6 bg-muted rounded-2xl p-1">
            <TabsTrigger
              data-ocid="admin.products_tab"
              value="products"
              className="rounded-xl gap-2"
            >
              <Package className="w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.orders_tab"
              value="orders"
              className="rounded-xl gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {products?.length ?? 0} products
              </p>
              <Button
                data-ocid="admin.add_product_button"
                onClick={openAdd}
                className="bg-primary text-white rounded-xl gap-2 font-semibold"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>

            {productsLoading ? (
              <div
                data-ocid="admin.products_loading_state"
                className="space-y-2"
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(products ?? []).map((product, idx) => (
                      <TableRow
                        key={product.id.toString()}
                        data-ocid={`admin.product_row.${idx + 1}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {getCategoryEmoji(product.category)}
                            </span>
                            <div>
                              <p className="font-semibold text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.nameHindi}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          ₹{(Number(product.price) / 100).toFixed(0)}
                        </TableCell>
                        <TableCell>{product.stock.toString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              data-ocid={`admin.edit_button.${idx + 1}`}
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(product)}
                              className="h-7 w-7 p-0 rounded-lg"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              data-ocid={`admin.delete_button.${idx + 1}`}
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
                              className="h-7 w-7 p-0 rounded-lg text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(products ?? []).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          <span data-ocid="admin.products_empty_state">
                            No products yet. Add one!
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {ordersLoading ? (
              <div data-ocid="admin.orders_loading_state" className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...(orders ?? [])]
                      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                      .map((order, idx) => (
                        <TableRow
                          key={order.id.toString()}
                          data-ocid={`admin.order_row.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-sm">
                            #{order.id.toString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.items.length} items
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{(Number(order.total) / 100).toFixed(0)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(val) =>
                                handleStatusChange(order.id, val)
                              }
                            >
                              <SelectTrigger
                                data-ocid={`admin.order_status_select.${idx + 1}`}
                                className={`h-7 text-xs rounded-full border-0 font-semibold w-44 ${STATUS_COLORS[order.status] ?? ""}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(STATUS_LABELS).map(
                                  ([val, label]) => (
                                    <SelectItem
                                      key={val}
                                      value={val}
                                      className="text-sm"
                                    >
                                      {label}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    {(orders ?? []).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-8"
                        >
                          <span data-ocid="admin.orders_empty_state">
                            No orders yet.
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Product Add/Edit Dialog */}
      <Dialog
        open={productDialog !== null}
        onOpenChange={(o) => !o && setProductDialog(null)}
      >
        <DialogContent
          data-ocid="admin.product_dialog"
          className="max-w-md rounded-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-bold">
              {productDialog === "edit" ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Name (English) *
                </Label>
                <Input
                  data-ocid="admin.product_name_input"
                  placeholder="Basmati Rice"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Hindi Name *</Label>
                <Input
                  data-ocid="admin.product_hindi_name_input"
                  placeholder="बासमती चावल"
                  value={form.nameHindi}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nameHindi: e.target.value }))
                  }
                  className="rounded-xl text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                data-ocid="admin.product_desc_textarea"
                placeholder="Product description..."
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="rounded-xl text-sm resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    data-ocid="admin.product_category_select"
                    className="rounded-xl text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c.id !== "All").map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Unit *</Label>
                <Input
                  data-ocid="admin.product_unit_input"
                  placeholder="kg, L, pcs"
                  value={form.unit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unit: e.target.value }))
                  }
                  className="rounded-xl text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Price (₹) *</Label>
                <Input
                  data-ocid="admin.product_price_input"
                  placeholder="145.00"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  className="rounded-xl text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Stock *</Label>
                <Input
                  data-ocid="admin.product_stock_input"
                  placeholder="100"
                  value={stockStr}
                  onChange={(e) => setStockStr(e.target.value)}
                  className="rounded-xl text-sm"
                  type="number"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Image URL (optional)
              </Label>
              <Input
                data-ocid="admin.product_image_input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className="rounded-xl text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.product_cancel_button"
              variant="outline"
              onClick={() => setProductDialog(null)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.product_save_button"
              onClick={handleSave}
              disabled={addProduct.isPending || updateProduct.isPending}
              className="bg-primary text-white rounded-xl font-bold"
            >
              {(addProduct.isPending || updateProduct.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {productDialog === "edit" ? "Update" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
