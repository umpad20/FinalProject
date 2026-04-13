import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ShoppingBag,
    Star,
    Truck,
    Shield,
    RotateCcw,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StoreLayout from '@/layouts/store-layout';
import type { Product, Category } from '@/types/store';

type HomeReview = {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    likesCount: number;
};

type HomeProps = {
    categories: Category[];
    featuredProducts: Product[];
    newArrivals: Product[];
    latestReviews: HomeReview[];
    customerCount: number;
};

export default function Home({ categories, featuredProducts, newArrivals, latestReviews, customerCount }: HomeProps) {
    const { auth } = usePage().props as any;
    const isLoggedIn = auth?.user;

    return (
        <StoreLayout>
            <Head title="Home" />

            {/* Hero Section */}
            <section
                className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted"
                aria-label="Hero"
            >
                <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="inline-block rounded-full border border-border px-4 py-1 text-sm text-muted-foreground">
                                New Collection 2026
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                                Elevate Your
                                <span className="block">Style Game</span>
                            </h1>
                            <p className="max-w-md text-lg text-muted-foreground">
                                Discover curated fashion pieces that blend
                                comfort with style. Premium quality clothing for
                                the modern individual.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" asChild>
                                    <Link href="/shop">
                                        Shop Now{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/shop?category=T-Shirts">
                                        Browse Collection
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                                <img
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                                    alt="Fashion collection showcase"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {/* Floating card */}
                            <div className="absolute -bottom-4 -left-4 rounded-lg border border-border bg-card p-4 shadow-lg md:-left-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <ShoppingBag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {customerCount}+
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Happy Customers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section
                className="border-y border-border bg-muted/50 py-8"
                aria-label="Features"
            >
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            {
                                icon: Truck,
                                title: 'Free Shipping',
                                desc: 'On orders over ₱2,000',
                            },
                            {
                                icon: Shield,
                                title: 'Secure Payment',
                                desc: '100% protected',
                            },
                            {
                                icon: RotateCcw,
                                title: 'Easy Returns',
                                desc: '30-day return policy',
                            },
                            {
                                icon: Star,
                                title: 'Premium Quality',
                                desc: 'Handpicked materials',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {feature.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16" aria-label="Shop by category">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Shop by Category
                            </h2>
                            <p className="mt-1 text-muted-foreground">
                                Find exactly what you&apos;re looking for
                            </p>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/shop">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/shop?category=${cat.name}`}
                                className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-3">
                                    <h3 className="text-sm font-semibold text-white">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-white/70">
                                        {cat.productCount} items
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section
                className="bg-muted/30 py-16"
                aria-label="Featured products"
            >
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Featured Products
                            </h2>
                            <p className="mt-1 text-muted-foreground">
                                Our hand-picked favorites
                            </p>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/shop">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner - Only show to non-logged-in users */}
            {!isLoggedIn && (
                <section className="py-16" aria-label="Promotion">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-primary-foreground md:px-16">
                            <div className="relative z-10 max-w-lg">
                                <p className="mb-2 text-sm font-medium tracking-wider uppercase opacity-80">
                                    Limited Time Offer
                                </p>
                                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                    Get 20% Off Your First Order
                                </h2>
                                <p className="mb-6 opacity-90">
                                    Sign up today and receive an exclusive discount
                                    on your first purchase. Don&apos;t miss out on
                                    premium fashion at unbeatable prices.
                                </p>
                                <Button variant="secondary" size="lg" asChild>
                                    <Link href="/register">Sign Up Now</Link>
                                </Button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10" />
                            <div className="absolute -right-8 -bottom-16 h-48 w-48 rounded-full bg-white/5" />
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {latestReviews.length > 0 && (
            <section
                className="bg-muted/30 py-16"
                aria-label="Customer testimonials"
            >
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold">
                            What Our Customers Say
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Real reviews from real people
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {latestReviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="mb-3 flex gap-1">
                                        {Array.from({ length: 5 }).map(
                                            (_, j) => (
                                                <Star
                                                    key={j}
                                                    className={`h-4 w-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                                />
                                            ),
                                        )}
                                    </div>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {review.userName}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* New Arrivals */}
            <section className="py-16" aria-label="New arrivals">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">New Arrivals</h2>
                            <p className="mt-1 text-muted-foreground">
                                Fresh drops this season
                            </p>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/shop">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </StoreLayout>
    );
}
