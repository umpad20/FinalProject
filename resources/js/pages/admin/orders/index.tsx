import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface OrderItem {
    id: number;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
}

interface OrderRow {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
}

interface Props {
    orders: OrderRow[];
}

export default function AdminOrders({ orders }: Props) {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter((order) => {
        if (activeTab !== 'all' && order.status !== activeTab) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                order.orderNumber.toLowerCase().includes(q) ||
                order.customerName.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Admin - Orders" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <p className="text-sm text-muted-foreground">
                    {orders.length} total orders
                </p>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by order number or customer..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search orders"
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-12 text-center text-muted-foreground"
                                            >
                                                {orders.length === 0
                                                    ? 'No orders yet.'
                                                    : 'No orders match your filters.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    {order.orderNumber}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {order.customerName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                order.customerEmail
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.items.length} item
                                                    {order.items.length > 1
                                                        ? 's'
                                                        : ''}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatPrice(order.total)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
                                                        {order.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        order.createdAt,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                        >
                                                            <Eye className="mr-1 h-4 w-4" />{' '}
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
