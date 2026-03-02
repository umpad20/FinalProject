import { Head, router, useForm } from '@inertiajs/react';
import {
    Edit,
    MoreHorizontal,
    Search,
    Shield,
    ShieldOff,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type UserItem = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
};

export default function AdminUsers({ users }: { users: UserItem[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>(
        'all',
    );
    const [createOpen, setCreateOpen] = useState(false);
    const [editUser, setEditUser] = useState<UserItem | null>(null);
    const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        is_admin: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        is_admin: false,
    });

    const filtered = users.filter((u) => {
        if (roleFilter === 'admin' && !u.isAdmin) return false;
        if (roleFilter === 'customer' && u.isAdmin) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (user: UserItem) => {
        setEditUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            is_admin: user.isAdmin,
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        editForm.put(`/admin/users/${editUser.id}`, {
            onSuccess: () => setEditUser(null),
        });
    };

    const handleDelete = () => {
        if (!deleteUser) return;
        router.delete(`/admin/users/${deleteUser.id}`, {
            onSuccess: () => setDeleteUser(null),
        });
    };

    const adminCount = users.filter((u) => u.isAdmin).length;
    const customerCount = users.filter((u) => !u.isAdmin).length;

    return (
        <AdminLayout title="User Management">
            <Head title="Admin - User Management" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Create and manage admin & customer accounts
                    </p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Users
                            </p>
                            <p className="text-xl font-bold">{users.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Admins
                            </p>
                            <p className="text-xl font-bold">{adminCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                            <ShieldOff className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Customers
                            </p>
                            <p className="text-xl font-bold">{customerCount}</p>
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
                            aria-label="Search users"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                roleFilter === 'all' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setRoleFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={
                                roleFilter === 'admin' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setRoleFilter('admin')}
                        >
                            Admins
                        </Button>
                        <Button
                            variant={
                                roleFilter === 'customer'
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => setRoleFilter('customer')}
                        >
                            Customers
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="text-center">
                                    Role
                                </TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="text-xs">
                                                    {user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                user.isAdmin
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {user.email === 'admin@jaypee.com'
                                                ? 'Main Admin'
                                                : user.isAdmin
                                                  ? 'Admin'
                                                  : 'Customer'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.createdAt}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    aria-label="User actions"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        openEdit(user)
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />{' '}
                                                    Edit
                                                </DropdownMenuItem>
                                                {user.email !==
                                                    'admin@jaypee.com' && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                setDeleteUser(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new admin or customer account.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Full Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                required
                            />
                            {createForm.errors.name && (
                                <p className="text-xs text-destructive">
                                    {createForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData('email', e.target.value)
                                }
                                required
                            />
                            {createForm.errors.email && (
                                <p className="text-xs text-destructive">
                                    {createForm.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) =>
                                    createForm.setData(
                                        'password',
                                        e.target.value,
                                    )
                                }
                                required
                                minLength={8}
                            />
                            {createForm.errors.password && (
                                <p className="text-xs text-destructive">
                                    {createForm.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="create-admin">
                                    Admin Access
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Grant full admin privileges
                                </p>
                            </div>
                            <Switch
                                id="create-admin"
                                checked={createForm.data.is_admin}
                                onCheckedChange={(v) =>
                                    createForm.setData('is_admin', v)
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing
                                    ? 'Creating...'
                                    : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog
                open={!!editUser}
                onOpenChange={(open) => !open && setEditUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user details. Leave password blank to keep
                            current.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.name && (
                                <p className="text-xs text-destructive">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.email && (
                                <p className="text-xs text-destructive">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-password">
                                New Password (optional)
                            </Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) =>
                                    editForm.setData('password', e.target.value)
                                }
                                minLength={8}
                                placeholder="Leave blank to keep current"
                            />
                            {editForm.errors.password && (
                                <p className="text-xs text-destructive">
                                    {editForm.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="edit-admin">Admin Access</Label>
                                <p className="text-xs text-muted-foreground">
                                    {editUser?.email === 'admin@jaypee.com'
                                        ? 'Main admin cannot be demoted'
                                        : 'Grant full admin privileges'}
                                </p>
                            </div>
                            <Switch
                                id="edit-admin"
                                checked={editForm.data.is_admin}
                                onCheckedChange={(v) =>
                                    editForm.setData('is_admin', v)
                                }
                                disabled={
                                    editUser?.email === 'admin@jaypee.com'
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteUser}
                onOpenChange={(open) => !open && setDeleteUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{deleteUser?.name}</strong> (
                            {deleteUser?.email})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
