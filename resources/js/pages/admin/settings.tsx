import { Head } from '@inertiajs/react';
import { Plus, Save, Store, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const defaultColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Olive', hex: '#556b2f' },
    { name: 'Beige', hex: '#d4a574' },
    { name: 'Brown', hex: '#8b4513' },
];

export default function AdminSettings() {
    const [storeName, setStoreName] = useState('Jaypee Clothing Store');
    const [storeEmail, setStoreEmail] = useState('hello@jaypeeclothing.com');
    const [storePhone, setStorePhone] = useState('+63 912 345 6789');
    const [storeAddress, setStoreAddress] = useState('123 Fashion Street, Makati City, Metro Manila, Philippines');
    const [storeDescription, setStoreDescription] = useState('Premium Filipino clothing brand offering modern streetwear and casual fashion for everyone.');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('2000');
    const [enableNotifications, setEnableNotifications] = useState(true);
    const [enableReviews, setEnableReviews] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const [sizes, setSizes] = useState(defaultSizes);
    const [newSize, setNewSize] = useState('');
    const [colors, setColors] = useState(defaultColors);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    const addSize = () => {
        if (newSize.trim() && !sizes.includes(newSize.trim().toUpperCase())) {
            setSizes([...sizes, newSize.trim().toUpperCase()]);
            setNewSize('');
        }
    };

    const removeSize = (s: string) => setSizes(sizes.filter((sz) => sz !== s));

    const addColor = () => {
        if (newColorName.trim() && !colors.find((c) => c.name.toLowerCase() === newColorName.trim().toLowerCase())) {
            setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
            setNewColorName('');
            setNewColorHex('#000000');
        }
    };

    const removeColor = (name: string) => setColors(colors.filter((c) => c.name !== name));

    return (
        <AdminLayout title="Settings">
            <Head title="Admin - Settings" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure store preferences and product attributes</p>
                </div>
                <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="sizes">Sizes</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5" />
                                    Store Information
                                </CardTitle>
                                <CardDescription>Basic store details visible to customers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">Contact Email</Label>
                                    <Input id="storeEmail" type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storePhone">Phone Number</Label>
                                    <Input id="storePhone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeAddress">Address</Label>
                                    <Input id="storeAddress" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeDesc">Description</Label>
                                    <Textarea id="storeDesc" rows={3} value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Toggle store features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="notifications">Order Notifications</Label>
                                        <p className="text-xs text-muted-foreground">Receive email alerts for new orders</p>
                                    </div>
                                    <Switch id="notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="reviews">Product Reviews</Label>
                                        <p className="text-xs text-muted-foreground">Allow customers to leave reviews</p>
                                    </div>
                                    <Switch id="reviews" checked={enableReviews} onCheckedChange={setEnableReviews} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="maintenance">Maintenance Mode</Label>
                                        <p className="text-xs text-muted-foreground">Temporarily disable the storefront</p>
                                    </div>
                                    <Switch id="maintenance" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Sizes */}
                <TabsContent value="sizes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Size Management</CardTitle>
                            <CardDescription>Define available product sizes. These will appear as options when creating product variants.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <Badge key={size} variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                                        {size}
                                        <button
                                            onClick={() => removeSize(size)}
                                            className="ml-1 rounded-full p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                                            aria-label={`Remove size ${size}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="New size (e.g. 3XL)"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSize()}
                                    className="w-48"
                                    aria-label="New size name"
                                />
                                <Button variant="outline" onClick={addSize}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Size
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Colors */}
                <TabsContent value="colors">
                    <Card>
                        <CardHeader>
                            <CardTitle>Color Management</CardTitle>
                            <CardDescription>Define available product colors with their hex values for visual display.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {colors.map((color) => (
                                    <div key={color.name} className="flex items-center gap-3 rounded-lg border p-3">
                                        <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{color.name}</p>
                                            <p className="font-mono text-xs text-muted-foreground">{color.hex}</p>
                                        </div>
                                        <button
                                            onClick={() => removeColor(color.name)}
                                            className="rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                                            aria-label={`Remove color ${color.name}`}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="colorName">Color Name</Label>
                                    <Input id="colorName" placeholder="e.g. Burgundy" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} className="w-48" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="colorHex">Hex Value</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="colorHex"
                                            type="color"
                                            value={newColorHex}
                                            onChange={(e) => setNewColorHex(e.target.value)}
                                            className="h-9 w-9 cursor-pointer rounded border"
                                            aria-label="Pick color"
                                        />
                                        <Input value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-28 font-mono" />
                                    </div>
                                </div>
                                <Button variant="outline" onClick={addColor}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Color
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping */}
                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Settings</CardTitle>
                            <CardDescription>Configure delivery options and thresholds</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="freeShipping">Free Shipping Threshold (₱)</Label>
                                <Input
                                    id="freeShipping"
                                    type="number"
                                    value={freeShippingThreshold}
                                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                                    className="w-48"
                                />
                                <p className="text-xs text-muted-foreground">Orders above this amount qualify for free shipping. Set to 0 to disable.</p>
                            </div>
                            <div className="space-y-3">
                                <Label>Delivery Areas</Label>
                                {[
                                    { area: 'Metro Manila', fee: '₱100', est: '1-2 days' },
                                    { area: 'Luzon', fee: '₱150', est: '3-5 days' },
                                    { area: 'Visayas', fee: '₱200', est: '5-7 days' },
                                    { area: 'Mindanao', fee: '₱250', est: '5-7 days' },
                                ].map((zone) => (
                                    <div key={zone.area} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{zone.area}</p>
                                            <p className="text-xs text-muted-foreground">{zone.est}</p>
                                        </div>
                                        <Badge variant="secondary">{zone.fee}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
