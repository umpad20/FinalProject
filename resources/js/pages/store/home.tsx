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
                className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat py-16 sm:py-20 md:py-32 lg:min-h-screen lg:py-0"
                style={{
                    backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1661281366900-88b41445a004?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center right',
                    backgroundAttachment: 'scroll',
                }}
                aria-label="Hero"
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:min-h-screen lg:py-0">
                    <div className="w-full max-w-2xl space-y-4 sm:space-y-6 md:space-y-8">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs sm:text-sm text-white backdrop-blur-sm">
                            New Collection 2026
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                            Elevate Your
                            <span className="block">Style Game</span>
                        </h1>
                        <p className="max-w-2xl text-base text-white/90 sm:text-lg md:text-xl">
                            Discover curated fashion pieces that blend comfort
                            with style. Premium quality clothing for the modern
                            individual.
                        </p>
                        <div className="flex flex-col gap-3 pt-2 sm:pt-4 sm:flex-row sm:gap-4">
                            <Button size="sm" className="bg-white text-black font-semibold hover:bg-gray-100 w-full sm:w-auto sm:size-lg" asChild>
                                <Link href="/shop">
                                    Shop Now{' '}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="sm" className="bg-white/20 text-white border-2 border-white font-semibold hover:bg-white/30 w-full sm:w-auto sm:size-lg" asChild>
                                <Link href="/shop?category=T-Shirts">
                                    Browse Collection
                                </Link>
                            </Button>
                        </div>

                        {/* Customer Count Card */}
                        <div className="pt-4 sm:pt-8">
                            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:gap-3 sm:p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black sm:h-12 sm:w-12">
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-white sm:text-lg">
                                        {customerCount}+
                                    </p>
                                    <p className="text-xs text-white/80 sm:text-sm">
                                        Happy Customers
                                    </p>
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
