import { Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface Customer {
    id: number;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    lastOrder: string | null;
    status: string;
}

interface Props {
    customers: Customer[];
}

export default function AdminCustomers({ customers }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = customers.filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
        (c) => c.status === 'active',
    ).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
        <AdminLayout title="Customers">
            <Head title="Admin - Customers" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <p className="text-sm text-muted-foreground">
                    View and manage your customer base
                </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Customers
                            </p>
                            <p className="text-xl font-bold">
                                {totalCustomers}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Active Customers
                            </p>
                            <p className="text-xl font-bold">
                                {activeCustomers}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Customer Revenue
                            </p>
                            <p className="text-xl font-bold">
                                {formatPrice(totalRevenue)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search customers"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                statusFilter === 'all' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={
                                statusFilter === 'active'
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                        >
                            Active
                        </Button>
                        <Button
                            variant={
                                statusFilter === 'inactive'
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                        >
                            Inactive
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-center">
                                    Orders
                                </TableHead>
                                <TableHead className="text-right">
                                    Total Spent
                                </TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead className="text-center">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        {customers.length === 0
                                            ? 'No customers yet.'
                                            : 'No customers match your criteria.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-xs">
                                                        {customer.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">
                                            {customer.orders}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatPrice(customer.totalSpent)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {customer.lastOrder ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    customer.status === 'active'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {customer.status === 'active'
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
