import { Head, Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice, mockCartItems } from '@/lib/mock-data';
import type { CartItem } from '@/types/store';

export default function Cart() {
    const [items, setItems] = useState<CartItem[]>(mockCartItems);
    const [promoCode, setPromoCode] = useState('');

    const updateQuantity = (id: number, newQty: number) => {
        if (newQty < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQty } : item,
            ),
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const shipping = subtotal >= 2000 ? 0 : 150;
    const total = subtotal + shipping;

    return (
        <StoreLayout>
            <Head title="Shopping Cart" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Breadcrumb */}
                <nav
                    className="mb-6 text-sm text-muted-foreground"
                    aria-label="Breadcrumb"
                >
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="font-medium text-foreground">
                            Shopping Cart
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
                        <h2 className="text-xl font-semibold">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Looks like you haven&apos;t added anything to your
                            cart yet.
                        </p>
                        <Button className="mt-6" asChild>
                            <Link href="/shop">
                                Continue Shopping{' '}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            {/* Header */}
                            <div className="hidden border-b border-border pb-3 md:grid md:grid-cols-12 md:gap-4">
                                <span className="col-span-6 text-sm font-semibold text-muted-foreground">
                                    Product
                                </span>
                                <span className="col-span-2 text-center text-sm font-semibold text-muted-foreground">
                                    Price
                                </span>
                                <span className="col-span-2 text-center text-sm font-semibold text-muted-foreground">
                                    Quantity
                                </span>
                                <span className="col-span-2 text-right text-sm font-semibold text-muted-foreground">
                                    Total
                                </span>
                            </div>

                            <div className="divide-y divide-border">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid items-center gap-4 py-6 md:grid-cols-12"
                                    >
                                        {/* Product */}
                                        <div className="col-span-6 flex items-center gap-4">
                                            <Link
                                                href={`/shop/${item.product.slug}`}
                                                className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                                            >
                                                <img
                                                    src={
                                                        item.product.images[0]
                                                            ?.url
                                                    }
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </Link>
                                            <div>
                                                <Link
                                                    href={`/shop/${item.product.slug}`}
                                                >
                                                    <h3 className="text-sm font-medium hover:underline">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Size: {item.variant.size}{' '}
                                                    &middot; Color:{' '}
                                                    {item.variant.color}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-1 h-auto p-0 text-xs text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    aria-label={`Remove ${item.product.name} from cart`}
                                                >
                                                    <Trash2 className="mr-1 h-3 w-3" />{' '}
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 text-center">
                                            <span className="text-sm font-medium">
                                                {formatPrice(
                                                    item.product.price,
                                                )}
                                            </span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2 flex items-center justify-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span
                                                className="flex h-8 w-10 items-center justify-center text-sm font-medium"
                                                aria-live="polite"
                                            >
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-2 text-right">
                                            <span className="text-sm font-semibold">
                                                {formatPrice(
                                                    item.product.price *
                                                        item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button variant="outline" asChild>
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Order Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal ({items.length} items)
                                        </span>
                                        <span className="font-medium">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>
                                        <span className="font-medium">
                                            {shipping === 0
                                                ? 'Free'
                                                : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Add {formatPrice(2000 - subtotal)}{' '}
                                            more for free shipping
                                        </p>
                                    )}
                                </div>

                                {/* Promo code */}
                                <div className="mt-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Promo code"
                                            value={promoCode}
                                            onChange={(e) =>
                                                setPromoCode(e.target.value)
                                            }
                                            className="text-sm"
                                            aria-label="Enter promo code"
                                        />
                                        <Button variant="outline" size="sm">
                                            Apply
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between">
                                    <span className="text-base font-semibold">
                                        Total
                                    </span>
                                    <span className="text-base font-bold">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <Button
                                    className="mt-6 w-full"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/checkout">
                                        Proceed to Checkout{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                <p className="mt-3 text-center text-xs text-muted-foreground">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
