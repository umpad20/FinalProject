<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Revenue: e-cash (gcash/card) counts immediately (non-cancelled);
        // COD only counts when delivery is marked 'delivered'
        $ecashRevenue = Order::where('status', '!=', 'cancelled')
            ->whereIn('payment_method', ['gcash', 'card'])
            ->sum('total');

        $codRevenue = Order::where('status', '!=', 'cancelled')
            ->where('payment_method', 'cod')
            ->whereHas('delivery', fn ($q) => $q->where('status', 'delivered'))
            ->sum('total');

        $totalRevenue = $ecashRevenue + $codRevenue;
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('is_admin', false)->count();

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'orderNumber' => $o->order_number,
                'customerName' => $o->user->name ?? 'Unknown',
                'total' => (float) $o->total,
                'status' => $o->status,
                'createdAt' => $o->created_at->toISOString(),
            ]);

        $topProducts = Product::with(['images', 'variants'])->get()
            ->sortByDesc(fn ($p) => $p->variants->sum('stock'))
            ->take(5)
            ->values()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'image' => $p->images->first()?->url,
                'totalStock' => $p->variants->sum('stock'),
                'price' => (float) $p->price,
            ]);

        $lowStockProducts = Product::with(['variants', 'images'])->get()
            ->filter(fn ($p) => $p->variants->contains(fn ($v) => $v->stock <= 5))
            ->take(5)
            ->values()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'image' => $p->images->first()?->url,
                'variants' => $p->variants->filter(fn ($v) => $v->stock <= 5)->values()->map(fn ($v) => [
                    'size' => $v->size,
                    'color' => $v->color,
                    'stock' => $v->stock,
                ]),
            ]);

        $orderStatusCounts = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'completed' => Order::where('status', 'completed')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
                'revenueChange' => 12.5,
                'ordersChange' => 8.3,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
            'orderStatusCounts' => $orderStatusCounts,
        ]);
    }
}
