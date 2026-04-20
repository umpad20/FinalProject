<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items', 'cancellation'])
            ->latest()
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'orderNumber' => $o->order_number,
                'customerName' => $o->user->name ?? 'Unknown',
                'customerEmail' => $o->user->email ?? '',
                'items' => $o->items->map(fn ($i) => [
                    'id' => $i->id,
                    'productName' => $i->product_name,
                    'productImage' => $i->product_image,
                    'size' => $i->size,
                    'color' => $i->color,
                    'quantity' => $i->quantity,
                    'price' => (float) $i->price,
                ]),
                'total' => (float) $o->total,
                'status' => $o->status,
                'paymentMethod' => $o->payment_method,
                'cancellation' => $o->cancellation ? [
                    'id' => $o->cancellation->id,
                    'reasonCategory' => $o->cancellation->reason_category,
                    'cancelledAt' => $o->cancellation->cancelled_at->toISOString(),
                ] : null,
                'createdAt' => $o->created_at->toISOString(),
            ]);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items', 'delivery', 'cancellation.user']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'customerName' => $order->user->name ?? 'Unknown',
                'customerEmail' => $order->user->email ?? '',
                'items' => $order->items->map(fn ($i) => [
                    'id' => $i->id,
                    'productName' => $i->product_name,
                    'productImage' => $i->product_image,
                    'size' => $i->size,
                    'color' => $i->color,
                    'quantity' => $i->quantity,
                    'price' => (float) $i->price,
                ]),
                'subtotal' => (float) $order->subtotal,
                'shipping' => (float) $order->shipping,
                'total' => (float) $order->total,
                'status' => $order->status,
                'paymentMethod' => $order->payment_method,
                'shippingAddress' => is_array($order->shipping_address) ? $order->shipping_address : (is_string($order->shipping_address) ? $order->shipping_address : null),
                'delivery' => $order->delivery ? [
                    'id' => $order->delivery->id,
                    'trackingNumber' => $order->delivery->tracking_number,
                    'status' => $order->delivery->status,
                    'estimatedDate' => $order->delivery->estimated_date?->format('Y-m-d'),
                ] : null,
                'cancellation' => $order->cancellation ? [
                    'id' => $order->cancellation->id,
                    'reasonCategory' => $order->cancellation->reason_category,
                    'reason' => $order->cancellation->reason,
                    'adminNotes' => $order->cancellation->admin_notes,
                    'cancelledAt' => $order->cancellation->cancelled_at->toISOString(),
                    'deductedAmount' => $order->cancellation->deducted_amount ? (float) $order->cancellation->deducted_amount : null,
                    'user' => [
                        'name' => $order->cancellation->user->name,
                        'email' => $order->cancellation->user->email,
                    ],
                ] : null,
                'createdAt' => $order->created_at->toISOString(),
                'updatedAt' => $order->updated_at->toISOString(),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        // Also update delivery status based on order status
        if ($order->delivery) {
            $deliveryStatus = match ($request->status) {
                'processing' => 'preparing',
                'shipped' => 'in-transit',
                'completed' => 'delivered',
                'cancelled' => 'returned',
                default => $order->delivery->status,
            };
            $order->delivery->update(['status' => $deliveryStatus]);
        }

        return back()->with('success', 'Order status updated.');
    }
}
