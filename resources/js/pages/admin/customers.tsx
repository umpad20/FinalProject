import { Head } from '@inertiajs/react';
import { Eye, Mail, MoreHorizontal, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

const mockCustomers = [
    { id: 1, name: 'Maria Santos', email: 'maria@example.com', phone: '+63 912 345 6789', orders: 12, totalSpent: 18500, lastOrder: '2025-01-15', status: 'active' },
    { id: 2, name: 'Juan Dela Cruz', email: 'juan@example.com', phone: '+63 923 456 7890', orders: 8, totalSpent: 12300, lastOrder: '2025-01-14', status: 'active' },
    { id: 3, name: 'Ana Reyes', email: 'ana@example.com', phone: '+63 934 567 8901', orders: 5, totalSpent: 8750, lastOrder: '2025-01-10', status: 'active' },
    { id: 4, name: 'Pedro Garcia', email: 'pedro@example.com', phone: '+63 945 678 9012', orders: 3, totalSpent: 4200, lastOrder: '2024-12-28', status: 'inactive' },
    { id: 5, name: 'Sofia Tan', email: 'sofia@example.com', phone: '+63 956 789 0123', orders: 15, totalSpent: 25600, lastOrder: '2025-01-16', status: 'active' },
    { id: 6, name: 'Carlos Lim', email: 'carlos@example.com', phone: '+63 967 890 1234', orders: 2, totalSpent: 2800, lastOrder: '2024-12-15', status: 'inactive' },
    { id: 7, name: 'Rosa Aquino', email: 'rosa@example.com', phone: '+63 978 901 2345', orders: 7, totalSpent: 11200, lastOrder: '2025-01-12', status: 'active' },
    { id: 8, name: 'Miguel Torres', email: 'miguel@example.com', phone: '+63 989 012 3456', orders: 1, totalSpent: 1500, lastOrder: '2025-01-08', status: 'active' },
];

export default function AdminCustomers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = mockCustomers.filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
        }
        return true;
    });

    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length;
    const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
        <AdminLayout title="Customers">
            <Head title="Admin - Customers" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <p className="text-sm text-muted-foreground">View and manage your customer base</p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Customers</p>
                            <p className="text-xl font-bold">{totalCustomers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Customers</p>
                            <p className="text-xl font-bold">{activeCustomers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Customer Revenue</p>
                            <p className="text-xl font-bold">{formatPrice(totalRevenue)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search customers"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>
                            All
                        </Button>
                        <Button variant={statusFilter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('active')}>
                            Active
                        </Button>
                        <Button variant={statusFilter === 'inactive' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('inactive')}>
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
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-center">Orders</TableHead>
                                <TableHead className="text-right">Total Spent</TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((customer) => (
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
                                                <p className="font-medium">{customer.name}</p>
                                                <p className="text-xs text-muted-foreground">{customer.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{customer.phone}</TableCell>
                                    <TableCell className="text-center font-medium">{customer.orders}</TableCell>
                                    <TableCell className="text-right font-medium">{formatPrice(customer.totalSpent)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{customer.lastOrder}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Customer actions">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" /> Send Email
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                        No customers found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
