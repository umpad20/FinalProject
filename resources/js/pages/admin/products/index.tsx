import { Head, Link } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice, mockProducts } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminProducts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const products = mockProducts.filter((p) => {
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const categories = [...new Set(mockProducts.map((p) => p.category))];

    return (
        <AdminLayout title="Products">
            <Head title="Admin - Products" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-sm text-muted-foreground">{mockProducts.length} total products</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search products"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]" aria-label="Filter by category">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-center">Variants</TableHead>
                                <TableHead className="text-center">Total Stock</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, i) => {
                                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                    <img src={product.images[0]?.url} alt={product.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.slug}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatPrice(product.price)}
                                            {product.compareAtPrice && (
                                                <span className="ml-1 text-xs text-muted-foreground line-through">
                                                    {formatPrice(product.compareAtPrice)}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">{product.variants.length}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={totalStock <= 10 ? 'font-bold text-red-500' : ''}>
                                                {totalStock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={totalStock > 0 ? 'default' : 'destructive'}>
                                                {totalStock > 0 ? 'Active' : 'Out of Stock'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/shop/${product.slug}`}>
                                                            <Eye className="mr-2 h-4 w-4" /> View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
