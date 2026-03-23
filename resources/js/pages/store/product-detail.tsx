import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/product-card';
import ReviewList from '@/components/review-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/utils';
import type { Product, Review } from '@/types/store';

type ProductDetailProps = {
    product: Product;
    relatedProducts: Product[];
    reviews: Review[];
    avgRating: number;
    reviewCount: number;
};

export default function ProductDetail({ product, relatedProducts, reviews, avgRating, reviewCount }: ProductDetailProps) {
    const auth = (usePage().props as any).auth;
    const isAuthenticated = !!auth?.user;
    const favoriteIds: number[] = auth?.user?.favorite_ids || [];
    const liked = favoriteIds.includes(product.id);

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>(
        product.colors[0]?.name || '',
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const currentVariant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
    );

    const hasDiscount =
        product.compareAtPrice && product.compareAtPrice > product.price;

    return (
        <StoreLayout>
            <Head title={product.name} />

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
                        <li>
                            <Link
                                href="/shop"
                                className="hover:text-foreground"
                            >
                                Shop
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href={`/shop?category=${product.category}`}
                                className="hover:text-foreground"
                            >
                                {product.category}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="font-medium text-foreground">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Images */}
                    <div className="space-y-4">
                        {/* Main image */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                            <img
                                src={product.images[selectedImageIndex]?.url}
                                alt={
                                    product.images[selectedImageIndex]?.alt ||
                                    product.name
                                }
                                className="h-full w-full object-cover"
                            />
                            {hasDiscount && (
                                <Badge
                                    variant="destructive"
                                    className="absolute top-4 left-4"
                                >
                                    Sale
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail images */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                                            selectedImageIndex === i
                                                ? 'border-primary'
                                                : 'border-border hover:border-muted-foreground'
                                        }`}
                                        onClick={() => setSelectedImageIndex(i)}
                                        aria-label={`View image ${i + 1}`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {product.category}
                            </p>
                            <h1 className="mt-1 text-3xl font-bold">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="mt-2 flex items-center gap-2">
                                <div
                                    className="flex gap-0.5"
                                    aria-label={`Rating: ${avgRating} out of 5 stars`}
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">
                                {formatPrice(product.price)}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatPrice(product.compareAtPrice!)}
                                </span>
                            )}
                        </div>

                        <Separator />

                        {/* Color selector */}
                        <div>
                            <Label className="text-sm font-semibold">
                                Color:{' '}
                                <span className="font-normal text-muted-foreground">
                                    {selectedColor}
                                </span>
                            </Label>
                            <div
                                className="mt-2 flex gap-3"
                                role="radiogroup"
                                aria-label="Select color"
                            >
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                                            selectedColor === color.name
                                                ? 'scale-110 border-primary'
                                                : 'border-transparent hover:border-muted-foreground/30'
                                        }`}
                                        onClick={() =>
                                            setSelectedColor(color.name)
                                        }
                                        role="radio"
                                        aria-checked={
                                            selectedColor === color.name
                                        }
                                        aria-label={color.name}
                                    >
                                        <span
                                            className="h-7 w-7 rounded-full border border-border"
                                            style={{
                                                backgroundColor: color.hex,
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size selector */}
                        <div>
                            <Label className="text-sm font-semibold">
                                Size:{' '}
                                <span className="font-normal text-muted-foreground">
                                    {selectedSize || 'Select a size'}
                                </span>
                            </Label>
                            <div
                                className="mt-2 flex flex-wrap gap-2"
                                role="radiogroup"
                                aria-label="Select size"
                            >
                                {product.sizes.map((size) => {
                                    const variant = product.variants.find(
                                        (v) =>
                                            v.size === size &&
                                            v.color === selectedColor,
                                    );
                                    const inStock = variant
                                        ? variant.stock > 0
                                        : false;
                                    return (
                                        <button
                                            key={size}
                                            className={`flex h-10 min-w-[40px] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                                                selectedSize === size
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : inStock
                                                      ? 'border-border hover:border-primary'
                                                      : 'cursor-not-allowed border-border line-through opacity-40'
                                            }`}
                                            onClick={() =>
                                                inStock && setSelectedSize(size)
                                            }
                                            disabled={!inStock}
                                            role="radio"
                                            aria-checked={selectedSize === size}
                                            aria-label={`Size ${size}${!inStock ? ' - Out of stock' : ''}`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <Label className="text-sm font-semibold">
                                Quantity
                            </Label>
                            <div className="mt-2 flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span
                                    className="flex h-10 w-14 items-center justify-center rounded-md border border-border text-sm font-medium"
                                    aria-live="polite"
                                    aria-label={`Quantity: ${quantity}`}
                                >
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={
                                        currentVariant
                                            ? quantity >= currentVariant.stock
                                            : false
                                    }
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                {currentVariant && (
                                    <span className="text-sm text-muted-foreground">
                                        {currentVariant.stock} in stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1"
                                disabled={!selectedSize || !currentVariant || addingToCart}
                                onClick={() => {
                                    if (!currentVariant) return;
                                    setAddingToCart(true);
                                    router.post('/cart', {
                                        product_id: product.id,
                                        variant_id: currentVariant.id,
                                        quantity: quantity,
                                    }, {
                                        preserveScroll: true,
                                        onFinish: () => setAddingToCart(false),
                                    });
                                }}
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                {addingToCart ? 'Adding...' : selectedSize ? 'Add to Cart' : 'Select a Size'}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (isLiking) return;
                                    if (!auth?.user) {
                                        router.visit('/login');
                                        return;
                                    }
                                    setIsLiking(true);
                                    router.post(`/favorites/${product.id}/toggle`, {}, {
                                        preserveScroll: true,
                                        onFinish: () => setIsLiking(false),
                                    });
                                }}
                                disabled={isLiking}
                                aria-label={
                                    liked
                                        ? 'Remove from wishlist'
                                        : 'Add to wishlist'
                                }
                            >
                                <Heart
                                    className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                                />
                            </Button>
                        </div>

                        {/* Delivery info */}
                        <div className="space-y-3 rounded-lg border border-border p-4">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Free Delivery
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        On orders over ₱2,000
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product details tabs */}
                <div className="mt-16">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="description">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="reviews">
                                Reviews ({reviewCount})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="leading-relaxed text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent value="details" className="mt-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Material
                                        </span>
                                        <span className="text-sm font-medium">
                                            100% Organic Cotton
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Fit
                                        </span>
                                        <span className="text-sm font-medium">
                                            Regular Fit
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Care
                                        </span>
                                        <span className="text-sm font-medium">
                                            Machine Washable
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Available Sizes
                                        </span>
                                        <span className="text-sm font-medium">
                                            {product.sizes.join(', ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Colors
                                        </span>
                                        <span className="text-sm font-medium">
                                            {product.colors
                                                .map((c) => c.name)
                                                .join(', ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            SKU
                                        </span>
                                        <span className="text-sm font-medium">
                                            {currentVariant?.sku ||
                                                'Select variant'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="reviews" className="mt-6">
                            <ReviewList
                                reviews={reviews}
                                avgRating={avgRating}
                                reviewCount={reviewCount}
                                isAuthenticated={isAuthenticated}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16" aria-label="Related products">
                        <h2 className="mb-6 text-2xl font-bold">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StoreLayout>
    );
}

function Label({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={className}>{children}</p>;
}