<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with(['product.images', 'product.category', 'variant'])
            ->where('user_id', auth()->id())
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => (float) $item->product->price,
                    'images' => $item->product->images->map(fn ($i) => [
                        'id' => $i->id,
                        'url' => $i->url,
                        'alt' => $i->alt,
                    ])->toArray(),
                ],
                'variant' => [
                    'id' => $item->variant->id,
                    'size' => $item->variant->size,
                    'color' => $item->variant->color,
                    'colorHex' => $item->variant->color_hex,
                    'stock' => $item->variant->stock,
                    'sku' => $item->variant->sku,
                ],
                'quantity' => $item->quantity,
            ]);

        return Inertia::render('store/cart', [
            'cartItems' => $cartItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = ProductVariant::findOrFail($request->variant_id);

        $cartItem = CartItem::where('user_id', auth()->id())
            ->where('product_variant_id', $request->variant_id)
            ->first();

        if ($cartItem) {
            $newQty = $cartItem->quantity + $request->quantity;
            if ($newQty > $variant->stock) {
                return back()->withErrors(['quantity' => 'Not enough stock available.']);
            }
            $cartItem->update(['quantity' => $newQty]);
        } else {
            if ($request->quantity > $variant->stock) {
                return back()->withErrors(['quantity' => 'Not enough stock available.']);
            }
            CartItem::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'product_variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Item added to cart!');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($request->quantity > $cartItem->variant->stock) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        return back();
    }

    public function remove(CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->delete();
        return back()->with('success', 'Item removed from cart.');
    }

    public function count()
    {
        return response()->json([
            'count' => CartItem::where('user_id', auth()->id())->sum('quantity'),
        ]);
    }
}
