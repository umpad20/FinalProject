import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/product-card';
import StoreLayout from '@/layouts/store-layout';
import type { Product } from '@/types/store';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Favorites({ products }: { products: Product[] }) {
    return (
        <StoreLayout>
            <Head title="My Wishlist | Jaypee Clothing Store" />

            <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                <div className="mb-8 text-center md:mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        My Wishlist
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        {products.length === 0
                            ? "You haven't saved any items yet."
                            : `You have ${products.length} item${products.length === 1 ? '' : 's'} in your wishlist.`}
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Heart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                        <p className="mt-2 text-muted-foreground text-center max-w-md mb-6">
                            Browse our collection and tap the heart icon to save items you love for later.
                        </p>
                        <Button asChild className="px-8">
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
