import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/utils';
import type { OrderItem } from '@/types/store';

type OrderDetailOrder = {
    id: number;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
    paymentMethod: string;
    shippingAddress: string;
    delivery: {
        trackingNumber: string | null;
        status: string;
        estimatedDate: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
};

type OrderDetailProps = {
    order: OrderDetailOrder;
};

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'completed', label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder = ['pending', 'processing', 'shipped', 'completed'];

export default function OrderDetail({ order }: OrderDetailProps) {
    const currentStepIndex = statusOrder.indexOf(order.status);

    return (
        <StoreLayout>
            <Head title={`Order ${order.orderNumber}`} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <Link
                    href="/customer/orders"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to orders
                </Link>

                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {order.orderNumber}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${
                            order.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : order.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : order.status === 'shipped'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                    >
                        {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                    </span>
                </div>

                {/* Progress tracker */}
                {order.status !== 'cancelled' && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                {statusSteps.map((step, i) => {
                                    const isCompleted = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    return (
                                        <div
                                            key={step.key}
                                            className="flex flex-1 items-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        isCompleted
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <step.icon className="h-5 w-5" />
                                                </div>
                                                <span
                                                    className={`text-xs font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                            {i < statusSteps.length - 1 && (
                                                <div
                                                    className={`mx-2 h-0.5 flex-1 ${i < currentStepIndex ? 'bg-primary' : 'bg-muted'}`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Order Items */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-border">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.productName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.size} &middot;
                                                Color: {item.color}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {order.shippingAddress}
                            </p>
                            {order.delivery && (
                                <div className="mt-3 space-y-1">
                                    {order.delivery.trackingNumber && (
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Tracking: </span>
                                            <span className="font-medium">{order.delivery.trackingNumber}</span>
                                        </p>
                                    )}
                                    {order.delivery.estimatedDate && (
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Est. delivery: </span>
                                            <span className="font-medium">{new Date(order.delivery.estimatedDate).toLocaleDateString()}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                            </p>
                            {order.paymentMethod === 'cod' && (
                                <p className="text-sm text-muted-foreground">
                                    Payment will be collected upon delivery
                                </p>
                            )}
                            <p className="mt-3 text-sm">
                                <span className="text-muted-foreground">
                                    Amount:{' '}
                                </span>
                                <span className="font-semibold">
                                    {formatPrice(order.total)}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </StoreLayout>
    );
}
