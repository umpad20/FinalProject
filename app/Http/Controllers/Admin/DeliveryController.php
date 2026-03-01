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
        $deliveries = Delivery::with(['order.user'])
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

        $delivery->update([
            'status' => $request->status,
            'tracking_number' => $request->tracking_number ?? $delivery->tracking_number,
        ]);

        return back()->with('success', 'Delivery status updated.');
    }
}
