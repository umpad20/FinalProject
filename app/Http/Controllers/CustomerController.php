<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $orders = $user->orders()->with(['items', 'delivery'])->latest()->get();

        // totalSpent: e-cash paid immediately; COD only when delivered
        $ecashSpent = (float) $orders
            ->where('status', '!=', 'cancelled')
            ->whereIn('payment_method', ['gcash', 'card'])
            ->sum('total');

        $codSpent = (float) $orders
            ->where('status', '!=', 'cancelled')
            ->where('payment_method', 'cod')
            ->filter(fn ($o) => $o->delivery && $o->delivery->status === 'delivered')
            ->sum('total');

        return Inertia::render('customer/dashboard', [
            'stats' => [
                'totalOrders' => $orders->count(),
                'pendingOrders' => $orders->where('status', 'pending')->count(),
                'totalSpent' => $ecashSpent + $codSpent,
            ],
            'recentOrders' => $orders->take(5)->map(fn ($o) => $this->formatOrder($o)),
        ]);
    }

    public function orders()
    {
        $orders = auth()->user()->orders()
            ->with('items')
            ->latest()
            ->get()
            ->map(fn ($o) => $this->formatOrder($o));

        return Inertia::render('customer/orders', [
            'orders' => $orders,
        ]);
    }

    public function orderDetail(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items', 'delivery']);

        // Find which products already have reviews from this user for this order
        $reviewedProductIds = Review::where('user_id', auth()->id())
            ->where('order_id', $order->id)
            ->pluck('product_id')
            ->toArray();

        return Inertia::render('customer/order-detail', [
            'order' => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'items' => $order->items->map(fn ($i) => [
                    'id' => $i->id,
                    'productId' => $i->product_id,
                    'productName' => $i->product_name,
                    'productImage' => $i->product_image,
                    'size' => $i->size,
                    'color' => $i->color,
                    'quantity' => $i->quantity,
                    'price' => (float) $i->price,
                    'reviewed' => in_array($i->product_id, $reviewedProductIds),
                ]),
                'subtotal' => (float) $order->subtotal,
                'shipping' => (float) $order->shipping,
                'total' => (float) $order->total,
                'status' => $order->status,
                'paymentMethod' => $order->payment_method,
                'shippingAddress' => is_array($order->shipping_address)
                    ? implode(', ', array_filter([
                        $order->shipping_address['address'] ?? '',
                        $order->shipping_address['city'] ?? '',
                        $order->shipping_address['province'] ?? '',
                    ]))
                    : ($order->shipping_address ?? ''),
                'delivery' => $order->delivery ? [
                    'trackingNumber' => $order->delivery->tracking_number,
                    'status' => $order->delivery->status,
                    'estimatedDate' => $order->delivery->estimated_date?->format('Y-m-d'),
                ] : null,
                'createdAt' => $order->created_at->toISOString(),
                'updatedAt' => $order->updated_at->toISOString(),
            ],
        ]);
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'items' => $order->items->map(fn ($i) => [
                'id' => $i->id,
                'productName' => $i->product_name,
                'productImage' => $i->product_image,
                'size' => $i->size,
                'color' => $i->color,
                'quantity' => $i->quantity,
                'price' => (float) $i->price,
            ]),
            'total' => (float) $order->total,
            'status' => $order->status,
            'customerName' => $order->user->name ?? 'Unknown',
            'customerEmail' => $order->user->email ?? '',
            'shippingAddress' => is_array($order->shipping_address)
                ? implode(', ', array_filter([
                    $order->shipping_address['address'] ?? '',
                    $order->shipping_address['city'] ?? '',
                    $order->shipping_address['province'] ?? '',
                ]))
                : ($order->shipping_address ?? ''),
            'createdAt' => $order->created_at->toISOString(),
            'updatedAt' => $order->updated_at->toISOString(),
        ];
    }
}
