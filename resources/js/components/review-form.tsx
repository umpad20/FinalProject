import { useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ReviewFormProps = {
    productId: number;
    orderId: number;
    productName: string;
};

export default function ReviewForm({ productId, orderId, productName }: ReviewFormProps) {
    const [open, setOpen] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: productId,
        order_id: orderId,
        rating: 0,
        comment: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/reviews', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Star className="mr-1.5 h-4 w-4" />
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Review Product</DialogTitle>
                        <DialogDescription>
                            Share your experience with <strong>{productName}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Star Rating */}
                        <div>
                            <Label className="text-sm font-medium">Rating</Label>
                            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        onClick={() => setData('rating', star)}
                                        role="radio"
                                        aria-checked={data.rating === star}
                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                    >
                                        <Star
                                            className={`h-7 w-7 transition-colors ${
                                                star <= (hoveredStar || data.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground/30'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="mt-1 text-sm text-destructive">{errors.rating}</p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <Label htmlFor="review-comment" className="text-sm font-medium">
                                Your Review
                            </Label>
                            <Textarea
                                id="review-comment"
                                className="mt-2"
                                placeholder="Tell others about your experience with this product..."
                                rows={4}
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                            />
                            {errors.comment && (
                                <p className="mt-1 text-sm text-destructive">{errors.comment}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.rating === 0 || !data.comment.trim()}
                        >
                            {processing ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
