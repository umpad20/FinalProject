<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'variants', 'category'])
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->price,
                'compareAtPrice' => $p->compare_at_price ? (float) $p->compare_at_price : null,
                'category' => $p->category->name,
                'images' => $p->images->map(fn ($i) => ['id' => $i->id, 'url' => $i->url, 'alt' => $i->alt]),
                'variants' => $p->variants->map(fn ($v) => [
                    'id' => $v->id, 'size' => $v->size, 'color' => $v->color,
                    'colorHex' => $v->color_hex, 'stock' => $v->stock, 'sku' => $v->sku,
                ]),
                'sizes' => $p->sizes,
                'colors' => $p->colors,
                'featured' => $p->featured,
                'status' => $p->status,
                'createdAt' => $p->created_at->toISOString(),
            ]);

        $categories = Category::all()->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = Category::all()->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'featured' => 'boolean',
            'status' => 'required|in:active,draft,archived',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string',
            'variants.*.color' => 'required|string',
            'variants.*.color_hex' => 'required|string|max:7',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.sku' => 'required|string|unique:product_variants,sku',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'category_id' => $request->category_id,
            'featured' => $request->featured ?? false,
            'status' => $request->status,
        ]);

        foreach ($request->variants as $variant) {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => $variant['size'],
                'color' => $variant['color'],
                'color_hex' => $variant['color_hex'],
                'stock' => $variant['stock'],
                'sku' => $variant['sku'],
            ]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => '/storage/' . $path,
                    'alt' => $product->name,
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully!');
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'variants', 'category']);
        $categories = Category::all()->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'compareAtPrice' => $product->compare_at_price ? (float) $product->compare_at_price : null,
                'category' => $product->category->name,
                'categoryId' => $product->category_id,
                'images' => $product->images->map(fn ($i) => ['id' => $i->id, 'url' => $i->url, 'alt' => $i->alt]),
                'variants' => $product->variants->map(fn ($v) => [
                    'id' => $v->id, 'size' => $v->size, 'color' => $v->color,
                    'colorHex' => $v->color_hex, 'stock' => $v->stock, 'sku' => $v->sku,
                ]),
                'sizes' => $product->sizes,
                'colors' => $product->colors,
                'featured' => $product->featured,
                'status' => $product->status,
                'createdAt' => $product->created_at->toISOString(),
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'featured' => 'boolean',
            'status' => 'required|in:active,draft,archived',
        ]);

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'category_id' => $request->category_id,
            'featured' => $request->featured ?? false,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        // Delete uploaded images from storage
        foreach ($product->images as $image) {
            if (str_starts_with($image->url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $image->url));
            }
        }

        $product->delete();
        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }

    public function uploadImages(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'image|max:2048',
        ]);

        $lastSort = $product->images()->max('sort_order') ?? -1;

        foreach ($request->file('images') as $file) {
            $lastSort++;
            $path = $file->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'url' => '/storage/' . $path,
                'alt' => $product->name,
                'sort_order' => $lastSort,
            ]);
        }

        return back()->with('success', 'Images uploaded successfully!');
    }

    public function deleteImage(Product $product, ProductImage $image)
    {
        if ($image->product_id !== $product->id) {
            abort(404);
        }

        if (str_starts_with($image->url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $image->url));
        }

        $image->delete();

        return back()->with('success', 'Image deleted.');
    }
}
