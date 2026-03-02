import { Head } from '@inertiajs/react';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { formatPrice } from '@/lib/utils';

interface TopProduct {
    name: string;
    unitsSold: number;
    revenue: number;
}

interface CategoryStat {
    category: string;
    orders: number;
    revenue: number;
    percentage: number;
}

interface Props {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        totalCustomers: number;
    };
    orderStatusCounts: Record<string, number>;
    paymentMethods: Record<string, number>;
    topProducts: TopProduct[];
    categoryBreakdown: CategoryStat[];
}

const statusColorMap: Record<string, string> = {
    completed: 'bg-green-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
};

export default function AdminReports({
    stats,
    orderStatusCounts,
    paymentMethods,
    topProducts,
    categoryBreakdown,
}: Props) {
    const avgOrderValue =
        stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

    const totalStatusOrders = Object.values(orderStatusCounts).reduce(
        (a, b) => a + b,
        0,
    );

    const statusEntries = Object.entries(orderStatusCounts).map(
        ([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count,
            percentage:
                totalStatusOrders > 0
                    ? Math.round((count / totalStatusOrders) * 100)
                    : 0,
            color: statusColorMap[status] ?? 'bg-gray-500',
        }),
    );

    const totalPayments = Object.values(paymentMethods).reduce(
        (a, b) => a + b,
        0,
    );
    const paymentEntries = Object.entries(paymentMethods).map(
        ([method, count]) => ({
            method,
            count,
            percentage:
                totalPayments > 0
                    ? Math.round((count / totalPayments) * 100)
                    : 0,
        }),
    );

    const maxUnitsSold = topProducts.length > 0 ? topProducts[0].unitsSold : 1;

    return (
        <AdminLayout title="Reports">
            <Head title="Admin - Reports" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    Business performance overview
                </p>
            </div>

            {/* Summary Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Revenue
                                </p>
                                <p className="text-xl font-bold">
                                    {formatPrice(stats.totalRevenue)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Orders
                                </p>
                                <p className="text-xl font-bold">
                                    {stats.totalOrders.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Avg. Order Value
                                </p>
                                <p className="text-xl font-bold">
                                    {formatPrice(avgOrderValue)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Products
                                </p>
                                <p className="text-xl font-bold">
                                    {stats.totalProducts}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="products" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="products">Top Products</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="orders">Order Analytics</TabsTrigger>
                </TabsList>

                {/* Top Products */}
                <TabsContent value="products">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {topProducts.length === 0 ? (
                                <p className="p-6 text-center text-muted-foreground">
                                    No sales data yet. Products will appear here
                                    after orders are placed.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-8">
                                                #
                                            </TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">
                                                Units Sold
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Revenue
                                            </TableHead>
                                            <TableHead className="w-32">
                                                Performance
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topProducts.map((p, i) => (
                                            <TableRow key={p.name}>
                                                <TableCell className="font-medium">
                                                    {i + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {p.name}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {p.unitsSold}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatPrice(p.revenue)}
                                                </TableCell>
                                                <TableCell>
                                                    <Progress
                                                        value={
                                                            (p.unitsSold /
                                                                maxUnitsSold) *
                                                            100
                                                        }
                                                        className="h-2"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Categories */}
                <TabsContent value="categories">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {categoryBreakdown.length === 0 ? (
                                <p className="text-center text-muted-foreground">
                                    No category data yet.
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {categoryBreakdown.map((cat) => (
                                        <div
                                            key={cat.category}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {cat.category}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {cat.orders} orders
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(
                                                            cat.revenue,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {cat.percentage}% of
                                                        total
                                                    </p>
                                                </div>
                                            </div>
                                            <Progress
                                                value={cat.percentage}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Order Analytics */}
                <TabsContent value="orders">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {statusEntries.length === 0 ? (
                                    <p className="text-center text-muted-foreground">
                                        No orders yet.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {statusEntries.map((item) => (
                                            <div
                                                key={item.status}
                                                className="flex items-center gap-3"
                                            >
                                                <div
                                                    className={`h-3 w-3 rounded-full ${item.color}`}
                                                />
                                                <span className="w-24 text-sm">
                                                    {item.status}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="h-5 w-full overflow-hidden rounded bg-muted">
                                                        <div
                                                            className={`h-full ${item.color} transition-all`}
                                                            style={{
                                                                width: `${item.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="w-8 text-right text-sm font-medium">
                                                    {item.count}
                                                </span>
                                                <span className="w-10 text-right text-xs text-muted-foreground">
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {paymentEntries.length === 0 ? (
                                    <p className="text-center text-muted-foreground">
                                        No payment data yet.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {paymentEntries.map((item) => (
                                            <div
                                                key={item.method}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">
                                                            {item.method}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.count}{' '}
                                                            transactions
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {item.percentage}%
                                                    </Badge>
                                                </div>
                                                <Progress
                                                    value={item.percentage}
                                                    className="mt-3 h-1.5"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
