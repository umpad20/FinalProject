import { Head, Link } from '@inertiajs/react';
import { Package, ShoppingBag, CreditCard, Heart, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, mockOrders } from '@/lib/mock-data';
import StoreLayout from '@/layouts/store-layout';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function CustomerDashboard() {
    const recentOrders = mockOrders.slice(0, 3);

    return (
        <StoreLayout>
            <Head title="My Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Welcome back, Juan!</h1>
                    <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your account.</p>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Package, label: 'Total Orders', value: '4', color: 'text-blue-600 dark:text-blue-400' },
                        { icon: Clock, label: 'Pending', value: '1', color: 'text-yellow-600 dark:text-yellow-400' },
                        { icon: CreditCard, label: 'Total Spent', value: formatPrice(624.90), color: 'text-green-600 dark:text-green-400' },
                        { icon: Heart, label: 'Wishlist Items', value: '7', color: 'text-red-600 dark:text-red-400' },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Recent Orders</CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/customer/orders">
                                        View All <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {order.items.slice(0, 3).map((item, i) => (
                                                        <img
                                                            key={i}
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="h-10 w-10 rounded-full border-2 border-background object-cover"
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{order.orderNumber}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''} &middot; {order.createdAt}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { label: 'My Orders', href: '/customer/orders', icon: Package },
                                    { label: 'Continue Shopping', href: '/shop', icon: ShoppingBag },
                                    { label: 'View Cart', href: '/cart', icon: ShoppingBag },
                                    { label: 'Account Settings', href: '/settings/profile', icon: CreditCard },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-accent"
                                    >
                                        <link.icon className="h-4 w-4 text-muted-foreground" />
                                        {link.label}
                                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="text-sm font-medium">Juan Dela Cruz</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">juan@example.com</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Member since</p>
                                    <p className="text-sm font-medium">January 2026</p>
                                </div>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href="/settings/profile">Edit Profile</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
