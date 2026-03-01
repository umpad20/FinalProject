import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, Download, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockProducts, mockOrders, mockSalesStats, formatPrice } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

const monthlySales = [
    { month: 'Jan', revenue: 45000, orders: 32 },
    { month: 'Feb', revenue: 52000, orders: 38 },
    { month: 'Mar', revenue: 48000, orders: 35 },
    { month: 'Apr', revenue: 61000, orders: 45 },
    { month: 'May', revenue: 55000, orders: 40 },
    { month: 'Jun', revenue: 67000, orders: 52 },
    { month: 'Jul', revenue: 72000, orders: 58 },
    { month: 'Aug', revenue: 84250, orders: 65 },
];

const topProducts = mockProducts.slice(0, 5).map((p, i) => ({
    ...p,
    unitsSold: [120, 98, 85, 72, 65][i],
    revenue: [120, 98, 85, 72, 65][i] * p.price,
}));

const categoryBreakdown = [
    { category: 'T-Shirts', orders: 85, revenue: 127500, percentage: 35 },
    { category: 'Pants', orders: 62, revenue: 155000, percentage: 25 },
    { category: 'Jackets', orders: 45, revenue: 202500, percentage: 20 },
    { category: 'Dresses', orders: 38, revenue: 114000, percentage: 12 },
    { category: 'Accessories', orders: 25, revenue: 37500, percentage: 8 },
];

const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue));

export default function AdminReports() {
    const [period, setPeriod] = useState('this-month');

    return (
        <AdminLayout title="Reports">
            <Head title="Admin - Reports" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                    <p className="text-sm text-muted-foreground">Business performance overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[160px]" aria-label="Select time period">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
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
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-xl font-bold">{formatPrice(mockSalesStats.totalRevenue)}</p>
                                <p className="text-xs text-green-600">+12.5% vs last period</p>
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
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-xl font-bold">{mockSalesStats.totalOrders.toLocaleString()}</p>
                                <p className="text-xs text-green-600">+8.3% vs last period</p>
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
                                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                                <p className="text-xl font-bold">{formatPrice(mockSalesStats.totalRevenue / mockSalesStats.totalOrders)}</p>
                                <p className="text-xs text-green-600">+3.2% vs last period</p>
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
                                <p className="text-sm text-muted-foreground">Products Sold</p>
                                <p className="text-xl font-bold">440</p>
                                <p className="text-xs text-green-600">+15.1% vs last period</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sales">Sales Overview</TabsTrigger>
                    <TabsTrigger value="products">Top Products</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="orders">Order Analytics</TabsTrigger>
                </TabsList>

                {/* Sales Overview */}
                <TabsContent value="sales">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Monthly Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {monthlySales.map((m) => (
                                    <div key={m.month} className="flex items-center gap-4">
                                        <span className="w-10 text-sm font-medium text-muted-foreground">{m.month}</span>
                                        <div className="flex-1">
                                            <div className="relative h-8 w-full overflow-hidden rounded bg-muted">
                                                <div
                                                    className="flex h-full items-center rounded bg-primary transition-all duration-500"
                                                    style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                                                >
                                                    <span className="ml-2 text-xs font-medium text-primary-foreground">{formatPrice(m.revenue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="w-16 text-right text-sm text-muted-foreground">{m.orders} orders</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Top Products */}
                <TabsContent value="products">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8">#</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Units Sold</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                        <TableHead className="w-32">Performance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topProducts.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{i + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img src={p.images[0]?.url} alt={p.name} className="h-10 w-10 rounded object-cover" />
                                                    <div>
                                                        <p className="font-medium">{p.name}</p>
                                                        <p className="text-xs text-muted-foreground">{p.category}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{p.unitsSold}</TableCell>
                                            <TableCell className="text-right font-medium">{formatPrice(p.revenue)}</TableCell>
                                            <TableCell>
                                                <Progress value={(p.unitsSold / topProducts[0].unitsSold) * 100} className="h-2" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                            <div className="space-y-6">
                                {categoryBreakdown.map((cat) => (
                                    <div key={cat.category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{cat.category}</p>
                                                <p className="text-xs text-muted-foreground">{cat.orders} orders</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(cat.revenue)}</p>
                                                <p className="text-xs text-muted-foreground">{cat.percentage}% of total</p>
                                            </div>
                                        </div>
                                        <Progress value={cat.percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>
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
                                <div className="space-y-4">
                                    {[
                                        { status: 'Completed', count: 245, percentage: 60, color: 'bg-green-500' },
                                        { status: 'Processing', count: 82, percentage: 20, color: 'bg-blue-500' },
                                        { status: 'Shipped', count: 45, percentage: 11, color: 'bg-purple-500' },
                                        { status: 'Pending', count: 25, percentage: 6, color: 'bg-yellow-500' },
                                        { status: 'Cancelled', count: 12, percentage: 3, color: 'bg-red-500' },
                                    ].map((item) => (
                                        <div key={item.status} className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                            <span className="w-24 text-sm">{item.status}</span>
                                            <div className="flex-1">
                                                <div className="h-5 w-full overflow-hidden rounded bg-muted">
                                                    <div className={`h-full ${item.color} transition-all`} style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                            <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                                            <span className="w-10 text-right text-xs text-muted-foreground">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { method: 'Cash on Delivery', count: 165, percentage: 40, icon: '💵' },
                                        { method: 'GCash', count: 145, percentage: 35, icon: '📱' },
                                        { method: 'Credit/Debit Card', count: 99, percentage: 25, icon: '💳' },
                                    ].map((item) => (
                                        <div key={item.method} className="rounded-lg border p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{item.icon}</span>
                                                    <div>
                                                        <p className="font-medium">{item.method}</p>
                                                        <p className="text-xs text-muted-foreground">{item.count} transactions</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{item.percentage}%</Badge>
                                            </div>
                                            <Progress value={item.percentage} className="mt-3 h-1.5" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
