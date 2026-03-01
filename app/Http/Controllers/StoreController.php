<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function home()
    {
        $categories = Category::withCount('products')->get();
        $featuredProducts = Product::with(['images', 'variants', 'category'])
            ->where('featured', true)
            ->where('status', 'active')
            ->take(8)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        $newArrivals = Product::with(['images', 'variants', 'category'])
            ->where('status', 'active')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        return Inertia::render('store/home', [
            'categories' => $categories->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'image' => $c->image,
                'productCount' => $c->products_count,
            ]),
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
        ]);
    }

    public function products()
    {
        $products = Product::with(['images', 'variants', 'category'])
            ->where('status', 'active')
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        $categories = Category::all()->map(fn ($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
        ]);

        return Inertia::render('store/products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::with(['images', 'variants', 'category'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $relatedProducts = Product::with(['images', 'variants', 'category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->take(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        return Inertia::render('store/product-detail', [
            'product' => $this->formatProduct($product),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    private function formatProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'compareAtPrice' => $product->compare_at_price ? (float) $product->compare_at_price : null,
            'category' => $product->category->name,
            'images' => $product->images->map(fn ($i) => [
                'id' => $i->id,
                'url' => $i->url,
                'alt' => $i->alt,
            ])->toArray(),
            'variants' => $product->variants->map(fn ($v) => [
                'id' => $v->id,
                'size' => $v->size,
                'color' => $v->color,
                'colorHex' => $v->color_hex,
                'stock' => $v->stock,
                'sku' => $v->sku,
            ])->toArray(),
            'sizes' => $product->sizes,
            'colors' => $product->colors,
            'featured' => $product->featured,
            'createdAt' => $product->created_at->toISOString(),
        ];
    }
}
