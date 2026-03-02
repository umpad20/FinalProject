<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('is_admin', false)->count();

        // Order status distribution
        $orderStatusCounts = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Payment method breakdown
        $paymentMethods = Order::select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->pluck('count', 'payment_method')
            ->toArray();

        // Top selling products by quantity
        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as units_sold'), DB::raw('SUM(price * quantity) as revenue'))
            ->groupBy('product_name')
            ->orderByDesc('units_sold')
            ->limit(5)
            ->get()
            ->map(fn ($i) => [
                'name' => $i->product_name,
                'unitsSold' => (int) $i->units_sold,
                'revenue' => (float) $i->revenue,
            ]);

        // Category performance
        $categoryStats = Order::join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_name', '=', 'products.name')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                'categories.name as category',
                DB::raw('count(DISTINCT orders.id) as orders'),
                DB::raw('SUM(order_items.price * order_items.quantity) as revenue'),
            )
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($c) => [
                'category' => $c->category,
                'orders' => (int) $c->orders,
                'revenue' => (float) $c->revenue,
            ]);

        // Compute percentages for categories
        $totalCategoryRevenue = $categoryStats->sum('revenue');
        $categoryBreakdown = $categoryStats->map(fn ($c) => [
            ...$c,
            'percentage' => $totalCategoryRevenue > 0 ? round(($c['revenue'] / $totalCategoryRevenue) * 100) : 0,
        ])->values();

        return Inertia::render('admin/reports', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
            ],
            'orderStatusCounts' => $orderStatusCounts,
            'paymentMethods' => $paymentMethods,
            'topProducts' => $topProducts,
            'categoryBreakdown' => $categoryBreakdown,
        ]);
    }
}
