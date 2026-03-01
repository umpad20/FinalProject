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
import AdminLayout from '@/layouts/admin-layout';

const categories = ['T-Shirts', 'Pants', 'Jackets', 'Dresses', 'Hoodies', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Brown', 'Olive', 'Red', 'Floral'];

export default function CreateProduct() {
    const [variants, setVariants] = useState([
        { size: 'M', color: 'Black', stock: 10, sku: '' },
    ]);
    const [isFeatured, setIsFeatured] = useState(false);

    const addVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Black', stock: 0, sku: '' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title="Add Product">
            <Head title="Admin - Add Product" />

            <div className="mb-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to products
                </Link>
            </div>

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
                                <Input id="name" placeholder="e.g. Classic White Tee" className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input id="slug" placeholder="classic-white-tee" className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Product description..." className="mt-1" rows={5} />
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
                                <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors">
                                    <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Upload Image</span>
                                </div>
                                <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors">
                                    <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Upload Image</span>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">PNG, JPG up to 5MB. First image will be the primary.</p>
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Variants (Size/Color/Stock)</CardTitle>
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
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sizes.map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Label>Color</Label>
                                            <Select defaultValue={variant.color}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {colors.map((c) => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-24">
                                            <Label>Stock</Label>
                                            <Input type="number" defaultValue={variant.stock} className="mt-1" min={0} />
                                        </div>
                                        <div className="flex-1">
                                            <Label>SKU</Label>
                                            <Input placeholder="SKU-001" className="mt-1" />
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

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="price">Price (₱)</Label>
                                <Input id="price" type="number" placeholder="0.00" className="mt-1" min={0} step={0.01} />
                            </div>
                            <div>
                                <Label htmlFor="comparePrice">Compare at Price (₱)</Label>
                                <Input id="comparePrice" type="number" placeholder="0.00" className="mt-1" min={0} step={0.01} />
                                <p className="mt-1 text-xs text-muted-foreground">Original price for sale display</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
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
                        <Button className="flex-1">Save Product</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
