import { Head, Link } from '@inertiajs/react';
import { Eye, Package, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/store';

type OrdersProps = {
    orders: Order[];
};

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

export default function CustomerOrders({ orders }: OrdersProps) {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter((order) => {
        if (activeTab !== 'all' && order.status !== activeTab) return false;
        if (
            searchQuery &&
            !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
            return false;
        return true;
    });

    return (
        <StoreLayout>
            <Head title="My Orders" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Breadcrumb */}
                <nav
                    className="mb-6 text-sm text-muted-foreground"
                    aria-label="Breadcrumb"
                >
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href="/customer/dashboard"
                                className="hover:text-foreground"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="font-medium text-foreground">Orders</li>
                    </ol>
                </nav>

                <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by order number..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search orders"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Orders</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="processing">Processing</TabsTrigger>
                        <TabsTrigger value="shipped">Shipped</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
                                <h3 className="text-lg font-semibold">
                                    No orders found
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {activeTab === 'all'
                                        ? "You haven't placed any orders yet."
                                        : `No ${activeTab} orders.`}
                                </p>
                                <Button className="mt-4" asChild>
                                    <Link href="/shop">Start Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <Card key={order.id}>
                                        <CardContent className="p-0">
                                            {/* Order header */}
                                            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-sm font-semibold">
                                                            {order.orderNumber}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Placed on{' '}
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}
                                                    >
                                                        {order.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            order.status.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                    <span className="text-sm font-bold">
                                                        {formatPrice(
                                                            order.total,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order items */}
                                            <div className="divide-y divide-border">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-4 p-4"
                                                    >
                                                        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                                                            <img
                                                                src={
                                                                    item.productImage
                                                                }
                                                                alt={
                                                                    item.productName
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    item.productName
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Size:{' '}
                                                                {item.size}{' '}
                                                                &middot; Color:{' '}
                                                                {item.color}{' '}
                                                                &middot; Qty:{' '}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {formatPrice(
                                                                item.price *
                                                                    item.quantity,
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order footer */}
                                            <div className="flex items-center justify-between border-t border-border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Ship to:{' '}
                                                    {order.shippingAddress}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/customer/orders/${order.id}`}
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />{' '}
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </StoreLayout>
    );
}
