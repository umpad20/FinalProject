import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import AdminLayout from '@/layouts/admin-layout';

interface OrderItem {
    id: number;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
}

interface OrderDetail {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
    paymentMethod: string;
    shippingAddress: string;
    delivery: { id: number; trackingNumber: string | null; status: string; estimatedDate: string | null } | null;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    order: OrderDetail;
}

export default function AdminOrderDetail({ order }: Props) {
    const [status, setStatus] = useState(order.status);
    const [updating, setUpdating] = useState(false);

    const handleUpdateStatus = () => {
        if (status === order.status) return;
        setUpdating(true);
        router.patch(`/admin/orders/${order.id}/status`, { status }, {
            preserveScroll: true,
            onFinish: () => setUpdating(false),
        });
    };

    return (
        <AdminLayout title={`Order ${order.orderNumber}`}>
            <Head title={`Admin - Order ${order.orderNumber}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to orders
                </Link>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Print Invoice
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {item.productImage && (
                                                        <img src={item.productImage} alt={item.productName} className="h-10 w-10 rounded-md object-cover" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium">{item.productName}</p>
                                                        <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatPrice(item.price * item.quantity)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="border-t px-6 py-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger aria-label="Update order status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="w-full" onClick={handleUpdateStatus} disabled={updating || status === order.status}>
                                {updating ? 'Updating...' : 'Update Status'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer */}
                    <Card>
                        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </CardContent>
                    </Card>

                    {/* Shipping */}
                    <Card>
                        <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.shippingAddress || 'No address provided'}</p>
                        </CardContent>
                    </Card>

                    {/* Delivery */}
                    {order.delivery && (
                        <Card>
                            <CardHeader><CardTitle>Delivery</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="capitalize">{order.delivery.status}</span>
                                </div>
                                {order.delivery.trackingNumber && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tracking</span>
                                        <span className="font-mono text-xs">{order.delivery.trackingNumber}</span>
                                    </div>
                                )}
                                {order.delivery.estimatedDate && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Est. Delivery</span>
                                        <span>{new Date(order.delivery.estimatedDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Dates */}
                    <Card>
                        <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Ordered</span>
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last Updated</span>
                                <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
