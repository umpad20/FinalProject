<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorite products.
     */
    public function index(Request $request)
    {
        // Get the authenticated user's favorites
        // Use eager loading for images and category to replicate the Shop page look
        $products = $request->user()
            ->favorites()
            ->with(['images', 'category', 'variants'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'price' => (float) $product->price,
                    'compareAtPrice' => $product->compare_at_price ? (float) $product->compare_at_price : null,
                    'category' => $product->category->name,
                    'featured' => $product->featured,
                    'status' => $product->status,
                    'images' => $product->images->map(fn ($i) => [
                        'id' => $i->id,
                        'url' => $i->url,
                        'alt' => $i->alt,
                    ])->toArray(),
                    'sizes' => $product->sizes,
                    'colors' => $product->colors,
                ];
            });

        return Inertia::render('customer/favorites', [
            'products' => $products,
        ]);
    }

    /**
     * Toggle a product in the user's favorites.
     */
    public function toggle(Request $request, Product $product)
    {
        $user = $request->user();

        // Toggle the favorite status: will detach if exists, attach if not
        $user->favorites()->toggle($product->id);

        return redirect()->back()->with('success', 'Wishlist updated');
    }
}
