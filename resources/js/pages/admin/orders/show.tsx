import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
    shippingAddress: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        province?: string;
        zip?: string;
    } | string | null;
    delivery: {
        id: number;
        trackingNumber: string | null;
        status: string;
        estimatedDate: string | null;
    } | null;
    cancellation: {
        id: number;
        reasonCategory: string;
        reason: string | null;
        adminNotes: string | null;
        cancelledAt: string;
        deductedAmount: number | null;
        user: {
            name: string;
            email: string;
        };
    } | null;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    order: OrderDetail;
}

export default function AdminOrderDetail({ order }: Props) {
    try {
        return (
            <AdminLayout title={`Order ${order.orderNumber}`}>
                <Head title={`Admin - Order ${order.orderNumber}`} />

                <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{order.orderNumber}</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            {order.customerName} • {order.customerEmail}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input hover:bg-accent transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Link>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    {/* LEFT COLUMN: Items & Pricing */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items ({order.items.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={item.id}>
                                        <div className="flex gap-4">
                                            {item.productImage && (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="h-20 w-20 object-cover rounded-lg border border-border"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold text-base">{item.productName}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {item.size} • {item.color}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Qty: <span className="font-medium">{item.quantity}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                                                <p className="text-lg font-bold mt-2">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                        {idx < order.items.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Price Breakdown Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Price Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-xl font-bold">{formatPrice(order.total)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Details Cards */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    backgroundColor: order.status === 'cancelled' ? '#fee2e2' : order.status === 'completed' ? '#dcfce7' : '#dbeafe',
                                    color: order.status === 'cancelled' ? '#991b1b' : order.status === 'completed' ? '#166534' : '#0c2d6b'
                                }}>
                                    {order.status}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-medium">{order.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm break-all">{order.customerEmail}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.shippingAddress && typeof order.shippingAddress === 'object' && 'first_name' in order.shippingAddress ? (
                                    <div className="space-y-1 text-sm">
                                        {(order.shippingAddress as any).first_name && <p><strong>{(order.shippingAddress as any).first_name} {(order.shippingAddress as any).last_name}</strong></p>}
                                        {(order.shippingAddress as any).address && <p>{(order.shippingAddress as any).address}</p>}
                                        {(order.shippingAddress as any).city && <p>{(order.shippingAddress as any).city}, {(order.shippingAddress as any).province} {(order.shippingAddress as any).zip}</p>}
                                        {(order.shippingAddress as any).phone && <p>Phone: {(order.shippingAddress as any).phone}</p>}
                                        {(order.shippingAddress as any).email && <p>Email: {(order.shippingAddress as any).email}</p>}
                                    </div>
                                ) : (
                                    <p className="text-sm">{typeof order.shippingAddress === 'string' ? order.shippingAddress : 'No address provided'}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Delivery Card */}
                        {order.delivery && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Delivery</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <p className="font-medium capitalize">{order.delivery.status}</p>
                                    </div>
                                    {order.delivery.trackingNumber && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tracking Number</p>
                                            <p className="font-mono text-sm">{order.delivery.trackingNumber}</p>
                                        </div>
                                    )}
                                    {order.delivery.estimatedDate && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Est. Delivery</p>
                                            <p className="font-medium">{new Date(order.delivery.estimatedDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Cancellation Card */}
                        {order.cancellation && (
                            <Card className="border-red-200 dark:border-red-900">
                                <CardHeader>
                                    <CardTitle className="text-base text-red-600 dark:text-red-400">Cancellation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cancelled By</p>
                                        <p className="font-medium">{order.cancellation.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.cancellation.user.email}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Reason</p>
                                        <p className="font-medium capitalize">{order.cancellation.reasonCategory.replace(/-/g, ' ')}</p>
                                    </div>
                                    {order.cancellation.reason && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Details</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.cancellation.reason}</p>
                                        </div>
                                    )}
                                    {order.cancellation.deductedAmount && (
                                        <div className="pt-2 border-t">
                                            <p className="text-xs text-muted-foreground">Amount Deducted</p>
                                            <p className="text-lg font-bold text-red-600 dark:text-red-400">-₱{order.cancellation.deductedAmount.toFixed(2)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Dates Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Ordered</p>
                                    <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </div>
            </AdminLayout>
        );
    } catch (error) {
        return (
            <AdminLayout title="Error">
                <div style={{ color: 'red', padding: '20px' }}>
                    <h1>Error Loading Order</h1>
                    <p>{String(error)}</p>
                </div>
            </AdminLayout>
        );
    }
}

