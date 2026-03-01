<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'orders' => $u->orders_count,
                'totalSpent' => (float) $u->orders()->where('status', '!=', 'cancelled')->sum('total'),
                'lastOrder' => $u->orders()->latest()->first()?->created_at?->format('Y-m-d'),
                'status' => $u->orders()->where('created_at', '>=', now()->subDays(30))->exists() ? 'active' : 'inactive',
            ]);

        return Inertia::render('admin/customers', [
            'customers' => $customers,
        ]);
    }
}
