import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import AdminLayout from '@/layouts/admin-layout';
import { formatPrice } from '@/lib/utils';

interface ProductItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    category: string;
    images: { id: number; url: string; alt: string | null }[];
    variants: {
        id: number;
        size: string;
        color: string;
        colorHex: string;
        stock: number;
        sku: string;
    }[];
    featured: boolean;
    status: string;
    createdAt: string;
}

interface Props {
    products: ProductItem[];
    categories: { id: number; name: string }[];
}

export default function AdminProducts({ products, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filtered = products.filter((p) => {
        if (categoryFilter !== 'all' && p.category !== categoryFilter)
            return false;
        if (
            searchQuery &&
            !p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
            return false;
        return true;
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <AdminLayout title="Products">
            <Head title="Admin - Products" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        {products.length} total products
                    </p>
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
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search products"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger
                            className="w-[180px]"
                            aria-label="Filter by category"
                        >
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
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
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                                <TableHead className="text-center">
                                    Variants
                                </TableHead>
                                <TableHead className="text-center">
                                    Total Stock
                                </TableHead>
                                <TableHead className="text-center">
                                    Status
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        {products.length === 0
                                            ? 'No products yet. Click "Add Product" to create your first one!'
                                            : 'No products match your filters.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((product, i) => {
                                    const totalStock = product.variants.reduce(
                                        (s, v) => s + v.stock,
                                        0,
                                    );
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="text-muted-foreground">
                                                {i + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                        {product.images[0]
                                                            ?.url ? (
                                                            <img
                                                                src={
                                                                    product
                                                                        .images[0]
                                                                        .url
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                                N/A
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {product.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatPrice(product.price)}
                                                {product.compareAtPrice && (
                                                    <span className="ml-1 text-xs text-muted-foreground line-through">
                                                        {formatPrice(
                                                            product.compareAtPrice,
                                                        )}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.variants.length}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={
                                                        totalStock <= 10
                                                            ? 'font-bold text-red-500'
                                                            : ''
                                                    }
                                                >
                                                    {totalStock}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        product.status ===
                                                        'active'
                                                            ? 'default'
                                                            : product.status ===
                                                                'draft'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {product.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        product.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Actions
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/shop/${product.slug}`}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/products/${product.id}/edit`}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />{' '}
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
