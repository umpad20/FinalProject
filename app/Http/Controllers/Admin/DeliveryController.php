<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::with(['order.user', 'order.cancellation'])
            ->latest()
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'orderNumber' => $d->order->order_number,
                'customerName' => $d->order->user->name ?? 'Unknown',
                'address' => $d->address,
                'status' => $d->status,
                'estimatedDate' => $d->estimated_date?->format('Y-m-d'),
                'trackingNumber' => $d->tracking_number ?? 'N/A',
                'isCancelled' => $d->order->cancellation ? true : false,
                'cancellationReason' => $d->order->cancellation?->reason_category,
                'cancelledAt' => $d->order->cancellation?->cancelled_at?->toISOString(),
            ]);

        return Inertia::render('admin/deliveries', [
            'deliveries' => $deliveries,
        ]);
    }

    public function updateStatus(Request $request, Delivery $delivery)
    {
        $request->validate([
            'status' => 'required|in:preparing,in-transit,delivered,returned',
            'tracking_number' => 'nullable|string',
        ]);

        $oldStatus = $delivery->status;
        $newStatus = $request->status;

        // Define allowed status transitions
        $allowedTransitions = [
            'preparing' => ['in-transit', 'returned'],  // Can ship or return before shipping
            'in-transit' => ['delivered', 'returned'],   // Can deliver or return after shipping
            'delivered' => ['returned'],                 // Can only return after delivery
            'returned' => [],                            // Final state, no transitions
        ];

        // Validate transition is allowed
        if (!in_array($newStatus, $allowedTransitions[$oldStatus] ?? [])) {
            return back()->withErrors(['status' => 'Invalid status transition']);
        }

        $delivery->update([
            'status' => $newStatus,
            'tracking_number' => $request->tracking_number ?? $delivery->tracking_number,
        ]);

        // Keep the order status in sync with the delivery status
        $orderStatus = match ($newStatus) {
            'preparing' => 'processing',
            'in-transit' => 'shipped',
            'delivered' => 'completed',
            'returned' => 'cancelled',
            default => null,
        };

        if ($orderStatus) {
            $delivery->order->update(['status' => $orderStatus]);
        }

        // Handle stock management based on delivery status change
        if ($oldStatus !== $newStatus) {
            // Refresh and reload with nested relationships
            $delivery = Delivery::with('order.items.variant')->find($delivery->id);

            // Deduct stock when shipping (Preparing → In Transit only)
            if ($newStatus === 'in-transit' && $oldStatus === 'preparing') {
                foreach ($delivery->order->items as $orderItem) {
                    $orderItem->variant->decrement('stock', $orderItem->quantity);
                }
            }
            // Restore stock when returning (only from in-transit or delivered)
            elseif ($newStatus === 'returned' && in_array($oldStatus, ['in-transit', 'delivered'])) {
                foreach ($delivery->order->items as $orderItem) {
                    $orderItem->variant->increment('stock', $orderItem->quantity);
                }
            }
            // If returning before shipping (Preparing → Returned), no stock change needed
        }

        return back()->with('success', 'Delivery status updated.');
    }
}
