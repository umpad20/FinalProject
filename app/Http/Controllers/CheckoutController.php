<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Request $request)
    {
        $query = CartItem::with(['product.images', 'variant'])
            ->where('user_id', auth()->id());

        $itemIds = $request->query('item_ids');
        if (!empty($itemIds) && is_array($itemIds)) {
            $query->whereIn('id', $itemIds);
        }

        $cartItems = $query->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty or no items were selected.');
        }

        return Inertia::render('store/checkout', [
            'cartItems' => $cartItems->map(fn ($item) => [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
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
                ],
                'quantity' => $item->quantity,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_ids' => 'required|array|min:1',
            'item_ids.*' => 'exists:cart_items,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'zip' => 'required|string',
            'payment_method' => 'required|in:cod,gcash,card',
        ]);

        $cartItems = CartItem::with(['product', 'variant'])
            ->where('user_id', auth()->id())
            ->whereIn('id', $request->item_ids)
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['cart' => 'Invalid items selected.']);
        }

        // Check stock
        foreach ($cartItems as $item) {
            if ($item->quantity > $item->variant->stock) {
                return back()->withErrors(['stock' => "{$item->product->name} ({$item->variant->size}/{$item->variant->color}) is out of stock."]);
            }
        }

        $subtotal = $cartItems->sum(fn ($item) => $item->product->price * $item->quantity);
        $shipping = $subtotal >= 2000 ? 0 : 100;
        $total = $subtotal + $shipping;

        $shippingAddress = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'province' => $request->province,
            'zip' => $request->zip,
        ];

        $order = Order::create([
            'order_number' => 'JP-' . strtoupper(Str::random(8)),
            'user_id' => auth()->id(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
            'payment_method' => $request->payment_method,
            'shipping_address' => $shippingAddress,
            'notes' => $request->notes,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'product_name' => $item->product->name,
                'product_image' => $item->product->images->first()?->url,
                'size' => $item->variant->size,
                'color' => $item->variant->color,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);

            // Reduce stock
            $item->variant->decrement('stock', $item->quantity);
        }

        // Create delivery record
        Delivery::create([
            'order_id' => $order->id,
            'status' => 'preparing',
            'estimated_date' => now()->addDays(5),
            'address' => "{$request->address}, {$request->city}, {$request->province} {$request->zip}",
        ]);

        // Clear selected cart items
        CartItem::where('user_id', auth()->id())->whereIn('id', $request->item_ids)->delete();

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Order placed successfully!');
    }
}
