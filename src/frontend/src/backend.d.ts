import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    nameHindi: string;
    name: string;
    unit: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface Order {
    id: bigint;
    status: Variant_cancelled_pending_outForDelivery_delivered_confirmed;
    deliveryAddress: string;
    total: bigint;
    createdAt: bigint;
    customerId: Principal;
    items: Array<{
        productId: bigint;
        quantity: bigint;
        price: bigint;
    }>;
}
export interface UserProfile {
    name: string;
    address: string;
    phone: string;
}
export interface Product {
    id: bigint;
    nameHindi: string;
    name: string;
    unit: string;
    isAvailable: boolean;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cancelled_pending_outForDelivery_delivered_confirmed {
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addProduct(productInput: ProductInput): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(customerId: Principal): Promise<Array<Order>>;
    getMyOrders(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    init(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<{
        productId: bigint;
        quantity: bigint;
    }>, deliveryAddress: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: bigint, status: Variant_cancelled_pending_outForDelivery_delivered_confirmed): Promise<void>;
    updateProduct(id: bigint, input: ProductInput): Promise<void>;
}
