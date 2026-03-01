import { Head } from '@inertiajs/react';
import { AlertTriangle, Package, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice, mockProducts } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminInventory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

    const allVariants = mockProducts.flatMap((p) =>
        p.variants.map((v) => ({
            product: p,
            variant: v,
        })),
    );

    const filteredVariants = allVariants.filter(({ product, variant }) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!product.name.toLowerCase().includes(q) && !variant.sku.toLowerCase().includes(q)) return false;
        }
        if (stockFilter === 'low' && variant.stock > 10) return false;
        if (stockFilter === 'out' && variant.stock > 0) return false;
        if (stockFilter === 'in' && variant.stock <= 0) return false;
        return true;
    });

    const totalStock = allVariants.reduce((sum, { variant }) => sum + variant.stock, 0);
    const lowStockCount = allVariants.filter(({ variant }) => variant.stock > 0 && variant.stock <= 10).length;
    const outOfStockCount = allVariants.filter(({ variant }) => variant.stock === 0).length;

    return (
        <AdminLayout title="Inventory">
            <Head title="Admin - Inventory" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                <p className="text-sm text-muted-foreground">Manage stock across all product variants</p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Stock</p>
                            <p className="text-xl font-bold">{totalStock} units</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Low Stock</p>
                            <p className="text-xl font-bold">{lowStockCount} variants</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Out of Stock</p>
                            <p className="text-xl font-bold">{outOfStockCount} variants</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by product name or SKU..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search inventory"
                        />
                    </div>
                    <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger className="w-[180px]" aria-label="Filter by stock level">
                            <SelectValue placeholder="Stock level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stock</SelectItem>
                            <SelectItem value="in">In Stock</SelectItem>
                            <SelectItem value="low">Low Stock (≤10)</SelectItem>
                            <SelectItem value="out">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-center">Size</TableHead>
                                <TableHead className="text-center">Color</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVariants.map(({ product, variant }) => (
                                <TableRow key={variant.sku}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img src={product.images[0]?.url} alt={product.name} className="h-8 w-8 rounded object-cover" />
                                            <span className="text-sm font-medium">{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{variant.sku}</TableCell>
                                    <TableCell className="text-center">{variant.size}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: variant.colorHex }} />
                                            <span className="text-sm">{variant.color}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            type="number"
                                            defaultValue={variant.stock}
                                            className="mx-auto w-20 text-center"
                                            min={0}
                                            aria-label={`Stock for ${product.name} ${variant.size} ${variant.color}`}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={variant.stock === 0 ? 'destructive' : variant.stock <= 10 ? 'secondary' : 'default'}>
                                            {variant.stock === 0 ? 'Out' : variant.stock <= 10 ? 'Low' : 'In Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="sm">Save</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
