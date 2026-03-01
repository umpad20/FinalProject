<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// ──────────────────────────────────────────────
// Public Store Routes (accessible to everyone)
// ──────────────────────────────────────────────

Route::inertia('/', 'store/home')->name('home');
Route::inertia('/shop', 'store/products')->name('shop');
Route::inertia('/shop/{slug}', 'store/product-detail')->name('product.show');
Route::inertia('/cart', 'store/cart')->name('cart');

// Keep original welcome page accessible if needed
Route::inertia('/welcome', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('welcome');

// ──────────────────────────────────────────────
// Authenticated Customer Routes
// ──────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/checkout', 'store/checkout')->name('checkout');
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    // Customer area
    Route::prefix('customer')->name('customer.')->group(function () {
        Route::inertia('/dashboard', 'customer/dashboard')->name('dashboard');
        Route::inertia('/orders', 'customer/orders')->name('orders');
        Route::inertia('/orders/{id}', 'customer/order-detail')->name('orders.show');
    });
});

// ──────────────────────────────────────────────
// Admin Routes
// ──────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::inertia('/dashboard', 'admin/dashboard')->name('dashboard');

    // Products
    Route::inertia('/products', 'admin/products/index')->name('products.index');
    Route::inertia('/products/create', 'admin/products/create')->name('products.create');
    Route::inertia('/products/{id}/edit', 'admin/products/edit')->name('products.edit');

    // Orders
    Route::inertia('/orders', 'admin/orders/index')->name('orders.index');
    Route::inertia('/orders/{id}', 'admin/orders/show')->name('orders.show');

    // Other admin pages
    Route::inertia('/inventory', 'admin/inventory')->name('inventory');
    Route::inertia('/deliveries', 'admin/deliveries')->name('deliveries');
    Route::inertia('/customers', 'admin/customers')->name('customers');
    Route::inertia('/reports', 'admin/reports')->name('reports');
    Route::inertia('/settings', 'admin/settings')->name('settings');
});

require __DIR__.'/settings.php';
