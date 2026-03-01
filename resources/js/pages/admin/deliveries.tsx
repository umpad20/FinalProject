import { Head } from '@inertiajs/react';
import { Search, Truck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDeliveries } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

const statusColors: Record<string, string> = {
    preparing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    returned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function AdminDeliveries() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDeliveries = mockDeliveries.filter((d) => {
        if (activeTab !== 'all' && d.status !== activeTab) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return d.orderNumber.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q) || d.trackingNumber.toLowerCase().includes(q);
        }
        return true;
    });

    return (
        <AdminLayout title="Deliveries">
            <Head title="Admin - Deliveries" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Delivery Management</h1>
                <p className="text-sm text-muted-foreground">Track and manage order deliveries</p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {[
                    { label: 'Preparing', count: mockDeliveries.filter((d) => d.status === 'preparing').length, color: 'text-yellow-600' },
                    { label: 'In Transit', count: mockDeliveries.filter((d) => d.status === 'in-transit').length, color: 'text-blue-600' },
                    { label: 'Delivered', count: mockDeliveries.filter((d) => d.status === 'delivered').length, color: 'text-green-600' },
                    { label: 'Returned', count: mockDeliveries.filter((d) => d.status === 'returned').length, color: 'text-red-600' },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Truck className={`h-5 w-5 ${stat.color}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold">{stat.count}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by order number, customer, or tracking..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search deliveries"
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="preparing">Preparing</TabsTrigger>
                    <TabsTrigger value="in-transit">In Transit</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="returned">Returned</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Tracking #</TableHead>
                                        <TableHead>Est. Date</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Update</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeliveries.map((delivery) => (
                                        <TableRow key={delivery.id}>
                                            <TableCell className="font-medium">{delivery.orderNumber}</TableCell>
                                            <TableCell>{delivery.customerName}</TableCell>
                                            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{delivery.address}</TableCell>
                                            <TableCell className="font-mono text-xs">{delivery.trackingNumber}</TableCell>
                                            <TableCell className="text-sm">{delivery.estimatedDate}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[delivery.status]}`}>
                                                    {delivery.status === 'in-transit' ? 'In Transit' : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Select defaultValue={delivery.status}>
                                                    <SelectTrigger className="w-[130px]" aria-label="Update delivery status">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="preparing">Preparing</SelectItem>
                                                        <SelectItem value="in-transit">In Transit</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="returned">Returned</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
