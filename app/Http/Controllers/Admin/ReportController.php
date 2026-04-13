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

    public function exportPdf()
    {
        // Gather comprehensive report data
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('is_admin', false)->count();

        $orderStatusCounts = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $paymentMethods = Order::select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->pluck('count', 'payment_method')
            ->toArray();

        // Top 5 products
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

        // Bottom 5 products (lowest revenue)
        $bottomProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as units_sold'), DB::raw('SUM(price * quantity) as revenue'))
            ->groupBy('product_name')
            ->orderBy('revenue', 'asc')
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

        $totalCategoryRevenue = $categoryStats->sum('revenue');
        $categoryBreakdown = $categoryStats->map(fn ($c) => [
            ...$c,
            'percentage' => $totalCategoryRevenue > 0 ? round(($c['revenue'] / $totalCategoryRevenue) * 100) : 0,
        ])->values();

        // Customer insights
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $completedOrders = Order::where('status', 'completed')->count();
        $conversionRate = $totalCustomers > 0 ? round(($totalOrders / $totalCustomers) * 100, 2) : 0;
        
        // Count customers with more than 1 order
        $repeatCustomers = Order::select('user_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('user_id')
            ->having('order_count', '>', 1)
            ->count();

        // Revenue by payment method with breakdown
        $revenueByPayment = Order::where('status', '!=', 'cancelled')
            ->select('payment_method', DB::raw('SUM(total) as revenue'), DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get()
            ->map(fn ($p) => [
                'method' => $p->payment_method,
                'revenue' => (float) $p->revenue,
                'count' => (int) $p->count,
                'percentage' => $totalRevenue > 0 ? round(($p->revenue / $totalRevenue) * 100, 2) : 0,
            ]);

        // Create TCPDF object
        $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
        
        // Set document properties
        $pdf->SetCreator('UMPAD GECAIN E-Commerce');
        $pdf->SetAuthor('Admin');
        $pdf->SetTitle('Comprehensive Business Report');
        $pdf->SetSubject('Detailed Sales and Business Analytics');
        $pdf->SetDefaultMonospacedFont('courier');

        // Set margins
        $pdf->SetMargins(10, 15, 10);
        $pdf->SetAutoPageBreak(true, 15);

        // ─────────────────────── PAGE 1 ───────────────────────
        $pdf->AddPage();

        // Header with branding
        $pdf->SetFont('Helvetica', 'B', 24);
        $pdf->SetTextColor(25, 118, 210); // Professional blue
        $pdf->Cell(0, 12, 'UMPAD GECAIN', 0, 1, 'C');
        $pdf->SetFont('Helvetica', '', 11);
        $pdf->SetTextColor(100, 100, 100);
        $pdf->Cell(0, 6, 'E-Commerce Platform - Business Report', 0, 1, 'C');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        // Report date
        $pdf->SetFont('Helvetica', '', 9);
        $pdf->SetTextColor(120, 120, 120);
        $pdf->Cell(0, 4, 'Report Generated: ' . now()->format('F d, Y \a\t H:i:s'), 0, 1, 'C');
        $pdf->Ln(3);

        // Executive Summary
        $pdf->SetFont('Helvetica', 'B', 13);
        $pdf->SetTextColor(25, 118, 210);
        $pdf->Cell(0, 8, 'EXECUTIVE SUMMARY', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        // KPI Cards
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetFillColor(240, 248, 255);
        
        $kpis = [
            ['Total Revenue', '₱ ' . number_format($totalRevenue, 2)],
            ['Total Orders', $totalOrders],
            ['Avg Order Value', '₱ ' . number_format($avgOrderValue, 2)],
            ['Total Customers', $totalCustomers],
        ];

        $cellWidth = 42;
        $cellHeight = 12;
        foreach ($kpis as $kpi) {
            $pdf->MultiCell($cellWidth, $cellHeight, $kpi[0], 1, 'C', true);
            $pdf->SetY($pdf->GetY() - $cellHeight);
            $pdf->SetX($pdf->GetX() + $cellWidth);
            $pdf->SetFont('Helvetica', 'B', 11);
            $pdf->MultiCell($cellWidth, $cellHeight, $kpi[1], 1, 'C', false);
            $pdf->SetX($pdf->GetX() + $cellWidth);
            $pdf->SetFont('Helvetica', 'B', 10);
        }
        $pdf->SetX(10);
        $pdf->Ln(2);

        // Key Metrics
        $pdf->SetFont('Helvetica', '', 10);
        $metricsText = "Completed Orders: $completedOrders  |  Conversion Rate: {$conversionRate}%  |  Repeat Customers: $repeatCustomers";
        $pdf->Cell(0, 6, $metricsText, 0, 1, 'C');
        $pdf->Ln(3);

        // Order Status Distribution
        $pdf->SetFont('Helvetica', 'B', 12);
        $pdf->SetTextColor(25, 118, 210);
        $pdf->Cell(0, 8, 'ORDER STATUS DISTRIBUTION', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetFillColor(200, 220, 255);
        $pdf->Cell(60, 7, 'Status', 1, 0, 'L', true);
        $pdf->Cell(35, 7, 'Count', 1, 0, 'R', true);
        $pdf->Cell(35, 7, 'Percentage', 1, 0, 'R', true);
        $pdf->Cell(50, 7, 'Bar Chart', 1, 1, 'L', true);

        $pdf->SetFont('Helvetica', '', 9);
        $totalStatus = array_sum($orderStatusCounts);
        $fill = false;
        foreach ($orderStatusCounts as $status => $count) {
            $percentage = $totalStatus > 0 ? round(($count / $totalStatus) * 100) : 0;
            $barWidth = $percentage / 2; // Scale for visual representation

            $fillColor = $fill ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Cell(60, 7, ucfirst($status), 1, 0, 'L', $fill);
            $pdf->Cell(35, 7, $count, 1, 0, 'R', $fill);
            $pdf->Cell(35, 7, $percentage . '%', 1, 0, 'R', $fill);
            
            // Simple bar representation
            $pdf->SetFillColor(52, 168, 219, $fill);
            $pdf->Cell($barWidth, 7, '', 1, 1, 'L', true);
            $fill = !$fill;
        }
        $pdf->Ln(2);

        // Payment Methods Revenue
        $pdf->SetFont('Helvetica', 'B', 12);
        $pdf->SetTextColor(25, 118, 210);
        $pdf->Cell(0, 8, 'REVENUE BY PAYMENT METHOD', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetFillColor(200, 220, 255);
        $pdf->Cell(50, 7, 'Payment Method', 1, 0, 'L', true);
        $pdf->Cell(40, 7, 'Transactions', 1, 0, 'R', true);
        $pdf->Cell(50, 7, 'Revenue', 1, 0, 'R', true);
        $pdf->Cell(40, 7, 'Share', 1, 1, 'R', true);

        $pdf->SetFont('Helvetica', '', 9);
        $fill = false;
        foreach ($revenueByPayment as $payment) {
            $fillColor = $fill ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Cell(50, 7, ucfirst(str_replace('_', ' ', $payment['method'])), 1, 0, 'L', $fill);
            $pdf->Cell(40, 7, $payment['count'], 1, 0, 'R', $fill);
            $pdf->Cell(50, 7, '₱ ' . number_format($payment['revenue'], 2), 1, 0, 'R', $fill);
            $pdf->Cell(40, 7, $payment['percentage'] . '%', 1, 1, 'R', $fill);
            $fill = !$fill;
        }

        // ─────────────────────── PAGE 2 ───────────────────────
        $pdf->AddPage();

        // Top Products
        $pdf->SetFont('Helvetica', 'B', 13);
        $pdf->SetTextColor(25, 118, 210);
        $pdf->Cell(0, 8, 'TOP PERFORMING PRODUCTS', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetFillColor(200, 220, 255);
        $pdf->Cell(90, 7, 'Product Name', 1, 0, 'L', true);
        $pdf->Cell(35, 7, 'Units Sold', 1, 0, 'R', true);
        $pdf->Cell(55, 7, 'Revenue', 1, 1, 'R', true);

        $pdf->SetFont('Helvetica', '', 9);
        $fill = false;
        foreach ($topProducts as $product) {
            $fillColor = $fill ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Cell(90, 7, substr($product['name'], 0, 40), 1, 0, 'L', $fill);
            $pdf->Cell(35, 7, $product['unitsSold'], 1, 0, 'R', $fill);
            $pdf->Cell(55, 7, '₱ ' . number_format($product['revenue'], 2), 1, 1, 'R', $fill);
            $fill = !$fill;
        }
        $pdf->Ln(3);

        // Bottom Products
        $pdf->SetFont('Helvetica', 'B', 13);
        $pdf->SetTextColor(211, 47, 47); // Red for low performers
        $pdf->Cell(0, 8, 'LOW PERFORMING PRODUCTS', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetFillColor(255, 220, 200);
        $pdf->Cell(90, 7, 'Product Name', 1, 0, 'L', true);
        $pdf->Cell(35, 7, 'Units Sold', 1, 0, 'R', true);
        $pdf->Cell(55, 7, 'Revenue', 1, 1, 'R', true);

        $pdf->SetFont('Helvetica', '', 9);
        $fill = false;
        foreach ($bottomProducts as $product) {
            $fillColor = $fill ? [255, 240, 220] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Cell(90, 7, substr($product['name'], 0, 40), 1, 0, 'L', $fill);
            $pdf->Cell(35, 7, $product['unitsSold'], 1, 0, 'R', $fill);
            $pdf->Cell(55, 7, '₱ ' . number_format($product['revenue'], 2), 1, 1, 'R', $fill);
            $fill = !$fill;
        }
        $pdf->Ln(3);

        // Category Performance
        $pdf->SetFont('Helvetica', 'B', 13);
        $pdf->SetTextColor(25, 118, 210);
        $pdf->Cell(0, 8, 'CATEGORY PERFORMANCE ANALYSIS', 0, 1, 'L');
        $pdf->SetLineWidth(0.5);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(2);

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetFillColor(200, 220, 255);
        $pdf->Cell(70, 7, 'Category', 1, 0, 'L', true);
        $pdf->Cell(30, 7, 'Orders', 1, 0, 'R', true);
        $pdf->Cell(50, 7, 'Revenue', 1, 0, 'R', true);
        $pdf->Cell(30, 7, 'Share', 1, 1, 'R', true);

        $pdf->SetFont('Helvetica', '', 9);
        $fill = false;
        foreach ($categoryBreakdown as $category) {
            $fillColor = $fill ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Cell(70, 7, substr($category['category'], 0, 30), 1, 0, 'L', $fill);
            $pdf->Cell(30, 7, $category['orders'], 1, 0, 'R', $fill);
            $pdf->Cell(50, 7, '₱ ' . number_format($category['revenue'], 2), 1, 0, 'R', $fill);
            $pdf->Cell(30, 7, $category['percentage'] . '%', 1, 1, 'R', $fill);
            $fill = !$fill;
        }
        $pdf->Ln(3);

        // Footer
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(150, 150, 150);
        $pdf->Cell(0, 5, 'This is a confidential business report. Unauthorized distribution is prohibited.', 0, 1, 'C');
        $pdf->Cell(0, 5, 'For questions, contact your administrator.', 0, 1, 'C');

        // Output PDF
        $filename = 'business-report-' . now()->format('Y-m-d-His') . '.pdf';
        $pdf->Output($filename, 'D');
    }
}
