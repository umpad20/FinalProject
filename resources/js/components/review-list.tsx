import { router } from '@inertiajs/react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Review } from '@/types/store';

type ReviewListProps = {
    reviews: Review[];
    avgRating: number;
    reviewCount: number;
    isAuthenticated: boolean;
};

export default function ReviewList({ reviews, avgRating, reviewCount, isAuthenticated }: ReviewListProps) {
    function handleLike(reviewId: number) {
        if (!isAuthenticated) return;
        router.post(`/reviews/${reviewId}/like`, {}, {
            preserveScroll: true,
        });
    }

    if (reviewCount === 0) {
        return (
            <div className="py-8 text-center">
                <Star className="mx-auto h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="text-center">
                    <p className="text-4xl font-bold">{avgRating}</p>
                    <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${
                                    i < Math.round(avgRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground/30'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Review Items - sorted by most helpful (backend already sorted) */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-0"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                    {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {review.userName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <Star
                                        key={j}
                                        className={`h-3 w-3 ${
                                            j < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {review.comment}
                        </p>

                        {/* Helpful / Like button */}
                        <div className="mt-3 flex items-center gap-2">
                            <Button
                                variant={review.likedByUser ? 'default' : 'outline'}
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                                onClick={() => handleLike(review.id)}
                                disabled={!isAuthenticated}
                                title={isAuthenticated ? (review.likedByUser ? 'Remove helpful vote' : 'Mark as helpful') : 'Log in to vote'}
                            >
                                <ThumbsUp className={`h-3.5 w-3.5 ${review.likedByUser ? 'fill-current' : ''}`} />
                                Helpful{review.likesCount > 0 && ` (${review.likesCount})`}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
