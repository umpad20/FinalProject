// E-Commerce store types

export type ProductImage = {
    id: number;
    url: string;
    alt: string;
};

export type ProductVariant = {
    id: number;
    size: string;
    color: string;
    colorHex: string;
    stock: number;
    sku: string;
};

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    images: ProductImage[];
    variants: ProductVariant[];
    sizes: string[];
    colors: { name: string; hex: string }[];
    featured: boolean;
    createdAt: string;
};

export type CartItem = {
    id: number;
    product: Product;
    variant: ProductVariant;
    quantity: number;
};

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'cancelled';

export type OrderItem = {
    id: number;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: number;
    orderNumber: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress: string;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    updatedAt: string;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    image: string;
    productCount: number;
};

export type SalesStats = {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenueChange: number;
    ordersChange: number;
};

export type DeliveryItem = {
    id: number;
    orderNumber: string;
    customerName: string;
    address: string;
    status: 'preparing' | 'in-transit' | 'delivered' | 'returned';
    estimatedDate: string;
    trackingNumber: string;
};
