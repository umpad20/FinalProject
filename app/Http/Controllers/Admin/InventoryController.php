<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'variants', 'category'])
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'category' => $p->category->name,
                'image' => $p->images->first()?->url,
                'variants' => $p->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'size' => $v->size,
                    'color' => $v->color,
                    'colorHex' => $v->color_hex,
                    'stock' => $v->stock,
                    'sku' => $v->sku,
                ]),
            ]);

        $totalStock = ProductVariant::sum('stock');
        $lowStock = ProductVariant::where('stock', '>', 0)->where('stock', '<=', 5)->count();
        $outOfStock = ProductVariant::where('stock', 0)->count();

        return Inertia::render('admin/inventory', [
            'products' => $products,
            'stats' => [
                'totalStock' => $totalStock,
                'lowStock' => $lowStock,
                'outOfStock' => $outOfStock,
            ],
        ]);
    }

    public function updateStock(Request $request, ProductVariant $variant)
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update(['stock' => $request->stock]);

        return back()->with('success', 'Stock updated.');
    }
}
