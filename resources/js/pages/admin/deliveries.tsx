import { Head, router } from '@inertiajs/react';
import { Search, Truck, X } from 'lucide-react';
import { useState } from 'react';
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

interface DeliveryRow {
    id: number;
    orderNumber: string;
    customerName: string;
    address: string;
    status: string;
    estimatedDate: string | null;
    trackingNumber: string;
    isCancelled: boolean;
    cancellationReason: string | null;
    cancelledAt: string | null;
}

interface Props {
    deliveries: DeliveryRow[];
}

const statusColors: Record<string, string> = {
    preparing:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-transit':
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    returned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function AdminDeliveries({ deliveries }: Props) {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openCancellationPopover, setOpenCancellationPopover] = useState<number | null>(null);

    const filteredDeliveries = deliveries.filter((d) => {
        if (activeTab !== 'all' && d.status !== activeTab) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                d.orderNumber.toLowerCase().includes(q) ||
                d.customerName.toLowerCase().includes(q) ||
                d.trackingNumber.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleStatusChange = (deliveryId: number, newStatus: string) => {
        router.patch(
            `/admin/deliveries/${deliveryId}`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const statusCounts = {
        preparing: deliveries.filter((d) => d.status === 'preparing').length,
        'in-transit': deliveries.filter((d) => d.status === 'in-transit')
            .length,
        delivered: deliveries.filter((d) => d.status === 'delivered').length,
        returned: deliveries.filter((d) => d.status === 'returned').length,
    };

    return (
        <AdminLayout title="Deliveries">
            <Head title="Admin - Deliveries" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Delivery Management</h1>
                <p className="text-sm text-muted-foreground">
                    Track and manage order deliveries
                </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {[
                    {
                        label: 'Preparing',
                        count: statusCounts.preparing,
                        color: 'text-yellow-600',
                    },
                    {
                        label: 'In Transit',
                        count: statusCounts['in-transit'],
                        color: 'text-blue-600',
                    },
                    {
                        label: 'Delivered',
                        count: statusCounts.delivered,
                        color: 'text-green-600',
                    },
                    {
                        label: 'Returned',
                        count: statusCounts.returned,
                        color: 'text-red-600',
                    },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Truck className={`h-5 w-5 ${stat.color}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-bold">
                                    {stat.count}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Cancellation
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Update
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeliveries.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-12 text-center text-muted-foreground"
                                            >
                                                {deliveries.length === 0
                                                    ? 'No deliveries yet.'
                                                    : 'No deliveries match your filters.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDeliveries.map((delivery) => (
                                            <TableRow key={delivery.id}>
                                                <TableCell className="font-medium">
                                                    {delivery.orderNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {delivery.customerName}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                                                    {delivery.address}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {delivery.trackingNumber}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {delivery.estimatedDate ??
                                                        '—'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[delivery.status] ?? ''}`}
                                                    >
                                                        {delivery.status ===
                                                        'in-transit'
                                                            ? 'In Transit'
                                                            : delivery.status
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              delivery.status.slice(
                                                                  1,
                                                              )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {delivery.isCancelled ? (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() =>
                                                                    setOpenCancellationPopover(
                                                                        openCancellationPopover ===
                                                                            delivery.id
                                                                            ? null
                                                                            : delivery.id,
                                                                    )
                                                                }
                                                                className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition cursor-pointer"
                                                            >
                                                                Cancelled
                                                            </button>
                                                            {openCancellationPopover ===
                                                                delivery.id && (
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-80 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg p-4 space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="font-semibold text-sm">
                                                                            Cancellation Details
                                                                        </h3>
                                                                        <button
                                                                            onClick={() =>
                                                                                setOpenCancellationPopover(
                                                                                    null,
                                                                                )
                                                                            }
                                                                            className="text-muted-foreground hover:text-foreground"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Reason
                                                                            </p>
                                                                            <p className="font-medium capitalize">
                                                                                {delivery.cancellationReason?.replace(
                                                                                    /-/g,
                                                                                    ' ',
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Cancelled On
                                                                            </p>
                                                                            <p className="text-sm">
                                                                                {new Date(
                                                                                    delivery.cancelledAt ||
                                                                                        '',
                                                                                ).toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Select
                                                        defaultValue={
                                                            delivery.status
                                                        }
                                                        onValueChange={(v) =>
                                                            handleStatusChange(
                                                                delivery.id,
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className="w-[130px]"
                                                            aria-label="Update delivery status"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {delivery.status === 'preparing' && (
                                                                <>
                                                                    <SelectItem value="in-transit">
                                                                        In Transit
                                                                    </SelectItem>
                                                                    <SelectItem value="returned">
                                                                        Returned
                                                                    </SelectItem>
                                                                </>
                                                            )}
                                                            {delivery.status === 'in-transit' && (
                                                                <>
                                                                    <SelectItem value="delivered">
                                                                        Delivered
                                                                    </SelectItem>
                                                                    <SelectItem value="returned">
                                                                        Returned
                                                                    </SelectItem>
                                                                </>
                                                            )}
                                                            {delivery.status === 'delivered' && (
                                                                <SelectItem value="returned">
                                                                    Returned
                                                                </SelectItem>
                                                            )}
                                                            {delivery.status === 'returned' && (
                                                                <SelectItem value="returned" disabled>
                                                                    Final State
                                                                </SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
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
