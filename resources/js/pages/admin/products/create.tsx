import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Plus, Trash2, Upload } from 'lucide-react';
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

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Olive', hex: '#556b2f' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Beige', hex: '#d4a574' },
];

interface Props {
    categories: { id: number; name: string }[];
}

export default function CreateProduct({ categories }: Props) {
    const form = useForm({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        category_id: '',
        featured: false,
        status: 'active',
        variants: [
            {
                size: 'M',
                color: 'Black',
                color_hex: '#000000',
                stock: 10,
                sku: '',
            },
        ],
        images: [] as File[],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        form.setData('images', [...form.data.images, ...files]);
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setPreviews((prev) => [...prev, ...newPreviews]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        form.setData(
            'images',
            form.data.images.filter((_, i) => i !== index),
        );
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        form.setData('variants', [
            ...form.data.variants,
            {
                size: 'M',
                color: 'Black',
                color_hex: '#000000',
                stock: 0,
                sku: '',
            },
        ]);
    };

    const removeVariant = (index: number) => {
        form.setData(
            'variants',
            form.data.variants.filter((_, i) => i !== index),
        );
    };

    const updateVariant = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        const updated = [...form.data.variants];
        if (field === 'color') {
            const colorObj = colorOptions.find((c) => c.name === value);
            updated[index] = {
                ...updated[index],
                color: value as string,
                color_hex: colorObj?.hex || '#000000',
            };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        form.setData('variants', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/products', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Add Product">
            <Head title="Admin - Add Product" />

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
                    {/* Main info */}
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
                                        placeholder="e.g. Classic White Tee"
                                        className="mt-1"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Product description..."
                                        className="mt-1"
                                        rows={5}
                                        value={form.data.description}
                                        onChange={(e) =>
                                            form.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {form.errors.description && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {form.errors.description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images */}
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
                                {previews.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {previews.map((src, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
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
                                {form.errors.images && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {form.errors.images}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Variants */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    Variants (Size/Color/Stock)
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addVariant}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add
                                    Variant
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {form.data.variants.map(
                                        (variant, index) => (
                                            <div
                                                key={index}
                                                className="flex items-end gap-3 rounded-lg border border-border p-4"
                                            >
                                                <div className="flex-1">
                                                    <Label>Size</Label>
                                                    <Select
                                                        value={variant.size}
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                'size',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sizes.map((s) => (
                                                                <SelectItem
                                                                    key={s}
                                                                    value={s}
                                                                >
                                                                    {s}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex-1">
                                                    <Label>Color</Label>
                                                    <Select
                                                        value={variant.color}
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                'color',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {colorOptions.map(
                                                                (c) => (
                                                                    <SelectItem
                                                                        key={
                                                                            c.name
                                                                        }
                                                                        value={
                                                                            c.name
                                                                        }
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className="h-3 w-3 rounded-full border"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        c.hex,
                                                                                }}
                                                                            />
                                                                            {
                                                                                c.name
                                                                            }
                                                                        </div>
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-24">
                                                    <Label>Stock</Label>
                                                    <Input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                index,
                                                                'stock',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                        className="mt-1"
                                                        min={0}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Label>SKU</Label>
                                                    <Input
                                                        placeholder="SKU-001"
                                                        className="mt-1"
                                                        value={variant.sku}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                index,
                                                                'sku',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        removeVariant(index)
                                                    }
                                                    disabled={
                                                        form.data.variants
                                                            .length <= 1
                                                    }
                                                    aria-label="Remove variant"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                    {form.errors.variants && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {form.errors.variants}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
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
                                        placeholder="0.00"
                                        className="mt-1"
                                        min={0}
                                        step={0.01}
                                        value={form.data.price}
                                        onChange={(e) =>
                                            form.setData(
                                                'price',
                                                e.target.value,
                                            )
                                        }
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
                                        placeholder="0.00"
                                        className="mt-1"
                                        min={0}
                                        step={0.01}
                                        value={form.data.compare_at_price}
                                        onChange={(e) =>
                                            form.setData(
                                                'compare_at_price',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Original price for sale display
                                    </p>
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
                                        <SelectValue placeholder="Select category" />
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

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={form.processing}
                            >
                                {form.processing ? 'Saving...' : 'Save Product'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
