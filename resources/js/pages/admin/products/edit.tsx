import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

interface ProductData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    category: string;
    categoryId: number;
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
    product: ProductData;
    categories: { id: number; name: string }[];
}

export default function EditProduct({ product, categories }: Props) {
    const form = useForm({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        compare_at_price: product.compareAtPrice
            ? String(product.compareAtPrice)
            : '',
        category_id: String(product.categoryId),
        featured: product.featured,
        status: product.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/products/${product.id}`);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setNewImages((prev) => [...prev, ...files]);
        setNewPreviews((prev) => [
            ...prev,
            ...files.map((f) => URL.createObjectURL(f)),
        ]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newPreviews[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadImages = () => {
        if (newImages.length === 0) return;
        const data = new FormData();
        newImages.forEach((file) => data.append('images[]', file));
        router.post(`/admin/products/${product.id}/images`, data, {
            preserveScroll: true,
            onSuccess: () => {
                newPreviews.forEach((url) => URL.revokeObjectURL(url));
                setNewImages([]);
                setNewPreviews([]);
            },
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Delete this image?')) {
            router.delete(`/admin/products/${product.id}/images/${imageId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = () => {
        if (
            confirm(
                'Are you sure you want to delete this product? This action cannot be undone.',
            )
        ) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    return (
        <AdminLayout title={`Edit: ${product.name}`}>
            <Head title={`Admin - Edit ${product.name}`} />

            <div className="mb-6">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to products
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={product.slug}
                                        className="mt-1"
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Auto-generated from name on save
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={form.data.description}
                                        onChange={(e) =>
                                            form.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                        rows={5}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images — existing + upload new */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Product Images</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <ImagePlus className="mr-1 h-4 w-4" /> Add
                                    Photos
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {product.images.map((img) => (
                                        <div
                                            key={img.id}
                                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.alt || ''}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteImage(img.id)
                                                }
                                                className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {newPreviews.map((src, index) => (
                                        <div
                                            key={`new-${index}`}
                                            className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-primary"
                                        >
                                            <img
                                                src={src}
                                                alt={`New ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewImage(index)
                                                }
                                                className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                            <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                New
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {product.images.length === 0 &&
                                    newPreviews.length === 0 && (
                                        <div
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm font-medium">
                                                Click to upload images
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG, WEBP up to 2MB each
                                            </p>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Current Variants (read-only display) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Variants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {product.variants.map((variant) => (
                                        <div
                                            key={variant.id}
                                            className="flex items-center gap-4 rounded-lg border border-border p-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-4 w-4 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            variant.colorHex,
                                                    }}
                                                />
                                                <span className="text-sm font-medium">
                                                    {variant.color}
                                                </span>
                                            </div>
                                            <span className="text-sm">
                                                Size: {variant.size}
                                            </span>
                                            <span className="text-sm">
                                                Stock: {variant.stock}
                                            </span>
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {variant.sku}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Manage stock levels in the Inventory page
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="price">Price (₱)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={form.data.price}
                                        onChange={(e) =>
                                            form.setData(
                                                'price',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                        min={0}
                                        step={0.01}
                                    />
                                    {form.errors.price && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {form.errors.price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="comparePrice">
                                        Compare at Price (₱)
                                    </Label>
                                    <Input
                                        id="comparePrice"
                                        type="number"
                                        value={form.data.compare_at_price}
                                        onChange={(e) =>
                                            form.setData(
                                                'compare_at_price',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                        min={0}
                                        step={0.01}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={form.data.category_id}
                                    onValueChange={(v) =>
                                        form.setData('category_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.category_id && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {form.errors.category_id}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Featured Product</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Show on homepage
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.data.featured}
                                        onCheckedChange={(v) =>
                                            form.setData('featured', v)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(v) =>
                                            form.setData('status', v)
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="archived">
                                                Archived
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {newImages.length > 0 && (
                            <Button
                                type="button"
                                className="w-full"
                                onClick={handleUploadImages}
                            >
                                <Upload className="mr-2 h-4 w-4" /> Upload{' '}
                                {newImages.length} New Image
                                {newImages.length > 1 ? 's' : ''}
                            </Button>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Updating...'
                                    : 'Update Product'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                        </Button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
