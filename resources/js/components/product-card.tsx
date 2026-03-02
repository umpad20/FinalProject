import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/mock-data';
import type { Product } from '@/types/store';

export default function ProductCard({ product }: { product: Product }) {
    const [isHovered, setIsHovered] = useState(false);
    const [liked, setLiked] = useState(false);
    const hasDiscount =
        product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(
              ((product.compareAtPrice! - product.price) /
                  product.compareAtPrice!) *
                  100,
          )
        : 0;

    return (
        <article
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
            aria-label={product.name}
        >
            {/* Image */}
            <Link
                href={`/shop/${product.slug}`}
                className="relative aspect-[3/4] overflow-hidden bg-muted"
            >
                <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                        <Badge variant="destructive" className="text-xs">
                            -{discountPercent}%
                        </Badge>
                    )}
                    {product.featured && (
                        <Badge className="text-xs">Featured</Badge>
                    )}
                </div>

                {/* Wishlist button */}
                <Button
                    variant="secondary"
                    size="icon"
                    className={`absolute top-2 right-2 h-8 w-8 rounded-full transition-opacity ${isHovered || liked ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setLiked(!liked);
                    }}
                    aria-label={
                        liked ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                >
                    <Heart
                        className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                </Button>

                {/* Quick add overlay */}
                <div
                    className={`absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        Quick View
                    </Button>
                </div>
            </Link>

            {/* Info */}
            <div className="flex flex-1 flex-col p-3">
                <p className="text-xs text-muted-foreground">
                    {product.category}
                </p>
                <Link href={`/shop/${product.slug}`}>
                    <h3 className="mt-1 text-sm leading-tight font-medium hover:underline">
                        {product.name}
                    </h3>
                </Link>

                {/* Colors */}
                <div
                    className="mt-2 flex items-center gap-1"
                    aria-label="Available colors"
                >
                    {product.colors.map((color) => (
                        <span
                            key={color.name}
                            className="h-3 w-3 rounded-full border border-border"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            role="img"
                            aria-label={color.name}
                        />
                    ))}
                </div>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold">
                        {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.compareAtPrice!)}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
