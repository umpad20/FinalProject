<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewLike;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Store a review for a product from a completed order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5|max:1000',
        ]);

        $user = $request->user();

        // Verify the order belongs to the user and is completed
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->firstOrFail();

        // Verify the product is in the order
        $orderHasProduct = $order->items()
            ->where('product_id', $validated['product_id'])
            ->exists();

        if (!$orderHasProduct) {
            return back()->withErrors(['product_id' => 'This product is not in the specified order.']);
        }

        // Check if already reviewed
        $exists = Review::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->where('order_id', $validated['order_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['review' => 'You have already reviewed this product for this order.']);
        }

        Review::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Review submitted successfully!');
    }

    /**
     * Toggle like on a review.
     */
    public function toggleLike(Request $request, Review $review)
    {
        $user = $request->user();

        $like = ReviewLike::where('user_id', $user->id)
            ->where('review_id', $review->id)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            ReviewLike::create([
                'user_id' => $user->id,
                'review_id' => $review->id,
            ]);
            $liked = true;
        }

        return back()->with('liked', $liked);
    }
}
