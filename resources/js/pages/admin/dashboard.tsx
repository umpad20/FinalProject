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
import { Progress } from '@/components/ui/progress';
import { formatPrice, mockOrders, mockProducts, mockSalesStats } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

const recentOrdersAdmin = mockOrders.slice(0, 5);

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const topProducts = mockProducts.slice(0, 5).map((p, i) => ({
    ...p,
    sold: [45, 38, 32, 28, 22][i],
    revenue: [45, 38, 32, 28, 22][i] * p.price,
}));

export default function AdminDashboard() {
    const stats = mockSalesStats;

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="mt-1 text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <ArrowUp className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-600">+{stats.revenueChange}%</span>
                            <span className="text-muted-foreground">from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="mt-1 text-2xl font-bold">{stats.totalOrders}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <ArrowUp className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-600">+{stats.ordersChange}%</span>
                            <span className="text-muted-foreground">from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Products</p>
                                <p className="mt-1 text-2xl font-bold">{stats.totalProducts}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                <Package className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">8 added this month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Customers</p>
                                <p className="mt-1 text-2xl font-bold">{stats.totalCustomers}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs">
                            <ArrowUp className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-600">+12</span>
                            <span className="text-muted-foreground">new this month</span>
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
                        <div className="space-y-4">
                            {recentOrdersAdmin.map((order) => (
                                <div key={order.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{order.orderNumber}</p>
                                            <p className="text-xs text-muted-foreground">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, i) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                        <img src={product.images[0]?.url} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                                    </div>
                                    <span className="text-sm font-semibold">{formatPrice(product.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: 'Completed', count: 89, total: 156, color: 'bg-green-500' },
                            { label: 'Processing', count: 34, total: 156, color: 'bg-blue-500' },
                            { label: 'Shipped', count: 18, total: 156, color: 'bg-purple-500' },
                            { label: 'Pending', count: 12, total: 156, color: 'bg-yellow-500' },
                            { label: 'Cancelled', count: 3, total: 156, color: 'bg-red-500' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>{item.label}</span>
                                    <span className="font-medium">{item.count} ({Math.round(item.count / item.total * 100)}%)</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={`h-full rounded-full ${item.color}`}
                                        style={{ width: `${(item.count / item.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card>
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockProducts
                                .flatMap((p) =>
                                    p.variants
                                        .filter((v) => v.stock <= 8)
                                        .map((v) => ({ product: p, variant: v })),
                                )
                                .slice(0, 5)
                                .map(({ product, variant }) => (
                                    <div key={variant.sku} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                <img src={product.images[0]?.url} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {variant.size} / {variant.color}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold ${variant.stock <= 5 ? 'text-red-500' : 'text-yellow-500'}`}>
                                            {variant.stock} left
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
