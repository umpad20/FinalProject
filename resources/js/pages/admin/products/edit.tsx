import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts } from '@/lib/mock-data';
import AdminLayout from '@/layouts/admin-layout';

const categories = ['T-Shirts', 'Pants', 'Jackets', 'Dresses', 'Hoodies', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Brown', 'Olive', 'Red', 'Floral'];

export default function EditProduct({ id }: { id?: number }) {
    const product = mockProducts.find((p) => p.id === Number(id)) || mockProducts[0];
    const [variants, setVariants] = useState(product.variants.map((v) => ({
        size: v.size, color: v.color, stock: v.stock, sku: v.sku,
    })));
    const [isFeatured, setIsFeatured] = useState(product.featured);

    const addVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Black', stock: 0, sku: '' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title={`Edit: ${product.name}`}>
            <Head title={`Admin - Edit ${product.name}`} />

            <div className="mb-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to products
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" defaultValue={product.name} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input id="slug" defaultValue={product.slug} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" defaultValue={product.description} className="mt-1" rows={5} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {product.images.map((img) => (
                                    <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                                        <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors">
                                    <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Add More</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Variants</CardTitle>
                            <Button variant="outline" size="sm" onClick={addVariant}>
                                <Plus className="mr-1 h-4 w-4" /> Add Variant
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div key={index} className="flex items-end gap-3 rounded-lg border border-border p-4">
                                        <div className="flex-1">
                                            <Label>Size</Label>
                                            <Select defaultValue={variant.size}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Label>Color</Label>
                                            <Select defaultValue={variant.color}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {colors.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-24">
                                            <Label>Stock</Label>
                                            <Input type="number" defaultValue={variant.stock} className="mt-1" min={0} />
                                        </div>
                                        <div className="flex-1">
                                            <Label>SKU</Label>
                                            <Input defaultValue={variant.sku} className="mt-1" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => removeVariant(index)}
                                            disabled={variants.length <= 1}
                                            aria-label="Remove variant"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="price">Price (₱)</Label>
                                <Input id="price" type="number" defaultValue={product.price} className="mt-1" min={0} step={0.01} />
                            </div>
                            <div>
                                <Label htmlFor="comparePrice">Compare at Price (₱)</Label>
                                <Input id="comparePrice" type="number" defaultValue={product.compareAtPrice || ''} className="mt-1" min={0} step={0.01} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Category</CardTitle></CardHeader>
                        <CardContent>
                            <Select defaultValue={product.category}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured Product</Label>
                                    <p className="text-xs text-muted-foreground">Show on homepage</p>
                                </div>
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button className="flex-1">Update Product</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    </div>

                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
