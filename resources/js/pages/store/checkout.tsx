import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice, mockCartItems } from '@/lib/mock-data';

export default function Checkout() {
    const items = mockCartItems;
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const shipping = subtotal >= 2000 ? 0 : 150;
    const total = subtotal + shipping;

    return (
        <StoreLayout>
            <Head title="Checkout" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Back link */}
                <Link
                    href="/cart"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to cart
                </Link>

                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Checkout form */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="firstName">
                                            First name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            placeholder="Juan"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">
                                            Last name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Dela Cruz"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="juan@example.com"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+63 912 345 6789"
                                        className="mt-1"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="address">
                                        Street address
                                    </Label>
                                    <Input
                                        id="address"
                                        placeholder="123 Main St"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="Manila"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="province">
                                            Province / Region
                                        </Label>
                                        <Input
                                            id="province"
                                            placeholder="Metro Manila"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="postalCode">
                                            Postal code
                                        </Label>
                                        <Input
                                            id="postalCode"
                                            placeholder="1000"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            defaultValue="Philippines"
                                            className="mt-1"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="notes">
                                        Order notes (optional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any special instructions..."
                                        className="mt-1"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="space-y-3"
                                >
                                    <div
                                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                    >
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label
                                            htmlFor="cod"
                                            className="flex-1 cursor-pointer"
                                        >
                                            <span className="font-medium">
                                                Cash on Delivery
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                Pay when your order arrives
                                            </p>
                                        </Label>
                                    </div>
                                    <div
                                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === 'gcash' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                    >
                                        <RadioGroupItem
                                            value="gcash"
                                            id="gcash"
                                        />
                                        <Label
                                            htmlFor="gcash"
                                            className="flex-1 cursor-pointer"
                                        >
                                            <span className="font-medium">
                                                GCash
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                Pay via GCash e-wallet
                                            </p>
                                        </Label>
                                    </div>
                                    <div
                                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                    >
                                        <RadioGroupItem
                                            value="card"
                                            id="card"
                                        />
                                        <Label
                                            htmlFor="card"
                                            className="flex-1 cursor-pointer"
                                        >
                                            <span className="font-medium">
                                                Credit / Debit Card
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                Visa, Mastercard, etc.
                                            </p>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {paymentMethod === 'card' && (
                                    <div className="mt-4 space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                                        <div>
                                            <Label htmlFor="cardNumber">
                                                Card number
                                            </Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="4242 4242 4242 4242"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="expiry">
                                                    Expiry date
                                                </Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={
                                                    item.product.images[0]?.url
                                                }
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.variant.size} /{' '}
                                                {item.variant.color}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {formatPrice(
                                                item.product.price *
                                                    item.quantity,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span>
                                        {shipping === 0
                                            ? 'Free'
                                            : formatPrice(shipping)}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <Button className="mt-6 w-full" size="lg">
                                <Lock className="mr-2 h-4 w-4" />
                                Place Order
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4" />
                                <span>
                                    Secure checkout - your data is protected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
