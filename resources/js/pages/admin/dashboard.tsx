import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { formatPrice } from '@/lib/utils';

interface DashboardProps {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        totalCustomers: number;
        revenueChange: number;
        ordersChange: number;
    };
    recentOrders: {
        id: number;
        orderNumber: string;
        customerName: string;
        total: number;
        status: string;
        createdAt: string;
    }[];
    topProducts: {
        id: number;
        name: string;
        image: string | null;
        totalStock: number;
        price: number;
    }[];
    lowStockProducts: {
        id: number;
        name: string;
        image: string | null;
        variants: { size: string; color: string; stock: number }[];
    }[];
    orderStatusCounts: {
        pending: number;
        processing: number;
        shipped: number;
        completed: number;
        cancelled: number;
    };
}

const statusColors: Record<string, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function AdminDashboard({
    stats,
    recentOrders,
    topProducts,
    lowStockProducts,
    orderStatusCounts,
}: DashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Revenue
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {formatPrice(stats.totalRevenue)}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            {stats.revenueChange >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-green-600" />
                            ) : (
                                <ArrowDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                                className={`font-medium ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {stats.revenueChange >= 0 ? '+' : ''}
                                {stats.revenueChange}%
                            </span>
                            <span className="text-muted-foreground">
                                from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Orders
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {stats.totalOrders}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            {stats.ordersChange >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-green-600" />
                            ) : (
                                <ArrowDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                                className={`font-medium ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {stats.ordersChange >= 0 ? '+' : ''}
                                {stats.ordersChange}%
                            </span>
                            <span className="text-muted-foreground">
                                from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Products
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {stats.totalProducts}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                <Package className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Manage in Products page
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Customers
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {stats.totalCustomers}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Registered users
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                                {order.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {order.orderNumber}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customerName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || ''}`}
                                            >
                                                {order.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    order.status.slice(1)}
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Products by Stock */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products (by Stock)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topProducts.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No products yet. Add products to get started!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((product, i) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    <Package className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {product.totalStock} in stock
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stats.totalOrders === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        ) : (
                            [
                                {
                                    label: 'Completed',
                                    count: orderStatusCounts.completed,
                                    color: 'bg-green-500',
                                },
                                {
                                    label: 'Processing',
                                    count: orderStatusCounts.processing,
                                    color: 'bg-blue-500',
                                },
                                {
                                    label: 'Shipped',
                                    count: orderStatusCounts.shipped,
                                    color: 'bg-purple-500',
                                },
                                {
                                    label: 'Pending',
                                    count: orderStatusCounts.pending,
                                    color: 'bg-yellow-500',
                                },
                                {
                                    label: 'Cancelled',
                                    count: orderStatusCounts.cancelled,
                                    color: 'bg-red-500',
                                },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{item.label}</span>
                                        <span className="font-medium">
                                            {item.count} (
                                            {stats.totalOrders > 0
                                                ? Math.round(
                                                      (item.count /
                                                          stats.totalOrders) *
                                                          100,
                                                  )
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{
                                                width: `${stats.totalOrders > 0 ? (item.count / stats.totalOrders) * 100 : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card>
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowStockProducts.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                All stock levels are healthy!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {lowStockProducts.map((product) =>
                                    product.variants.map((variant, vi) => (
                                        <div
                                            key={`${product.id}-${vi}`}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {variant.size} /{' '}
                                                        {variant.color}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${variant.stock <= 2 ? 'text-red-500' : 'text-yellow-500'}`}
                                            >
                                                {variant.stock} left
                                            </span>
                                        </div>
                                    )),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
