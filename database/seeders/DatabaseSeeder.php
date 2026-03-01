<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@jaypee.com',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Create Test Customer
        User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        // Categories
        $categories = [
            ['name' => 'T-Shirts', 'slug' => 't-shirts', 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
            ['name' => 'Pants', 'slug' => 'pants', 'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop'],
            ['name' => 'Jackets', 'slug' => 'jackets', 'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
            ['name' => 'Dresses', 'slug' => 'dresses', 'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
            ['name' => 'Hoodies', 'slug' => 'hoodies', 'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'image' => 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Products
        $products = [
            [
                'name' => 'Classic White Tee',
                'description' => 'A timeless white t-shirt made from 100% organic cotton. Comfortable fit with a clean, minimalist design perfect for everyday wear.',
                'price' => 599.00,
                'compare_at_price' => 799.00,
                'category' => 'T-Shirts',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', 'alt' => 'Classic White Tee front'],
                    ['url' => 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=800&fit=crop', 'alt' => 'Classic White Tee back'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 20, 'sku' => 'CWT-S-W'],
                    ['size' => 'M', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 25, 'sku' => 'CWT-M-W'],
                    ['size' => 'L', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 15, 'sku' => 'CWT-L-W'],
                    ['size' => 'XL', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 10, 'sku' => 'CWT-XL-W'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 18, 'sku' => 'CWT-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 12, 'sku' => 'CWT-L-B'],
                ],
            ],
            [
                'name' => 'Slim Fit Jeans',
                'description' => 'Modern slim-fit jeans crafted from premium stretch denim. Flattering silhouette that moves with you throughout the day.',
                'price' => 1299.00,
                'compare_at_price' => null,
                'category' => 'Pants',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', 'alt' => 'Slim Fit Jeans front'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 10, 'sku' => 'SFJ-S-N'],
                    ['size' => 'M', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 15, 'sku' => 'SFJ-M-N'],
                    ['size' => 'L', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 12, 'sku' => 'SFJ-L-N'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 8, 'sku' => 'SFJ-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 6, 'sku' => 'SFJ-L-B'],
                ],
            ],
            [
                'name' => 'Urban Bomber Jacket',
                'description' => 'Sleek bomber jacket with a modern edge. Water-resistant exterior with quilted lining for warmth. Perfect for layering.',
                'price' => 2499.00,
                'compare_at_price' => 2999.00,
                'category' => 'Jackets',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', 'alt' => 'Urban Bomber Jacket'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 8, 'sku' => 'UBJ-S-B'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 12, 'sku' => 'UBJ-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 10, 'sku' => 'UBJ-L-B'],
                    ['size' => 'M', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 5, 'sku' => 'UBJ-M-O'],
                    ['size' => 'L', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 3, 'sku' => 'UBJ-L-O'],
                ],
            ],
            [
                'name' => 'Floral Summer Dress',
                'description' => 'Light and breezy floral dress perfect for warm weather. Features a flattering A-line cut and adjustable waist tie.',
                'price' => 1599.00,
                'compare_at_price' => null,
                'category' => 'Dresses',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', 'alt' => 'Floral Summer Dress'],
                ],
                'variants' => [
                    ['size' => 'XS', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 6, 'sku' => 'FSD-XS-BG'],
                    ['size' => 'S', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 10, 'sku' => 'FSD-S-BG'],
                    ['size' => 'M', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 12, 'sku' => 'FSD-M-BG'],
                    ['size' => 'L', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 8, 'sku' => 'FSD-L-BG'],
                ],
            ],
            [
                'name' => 'Oversized Hoodie',
                'description' => 'Super comfortable oversized hoodie in thick fleece. Kangaroo pocket and adjustable drawstring hood.',
                'price' => 1199.00,
                'compare_at_price' => 1499.00,
                'category' => 'Hoodies',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop', 'alt' => 'Oversized Hoodie'],
                ],
                'variants' => [
                    ['size' => 'M', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 20, 'sku' => 'OH-M-G'],
                    ['size' => 'L', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 15, 'sku' => 'OH-L-G'],
                    ['size' => 'XL', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 10, 'sku' => 'OH-XL-G'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 18, 'sku' => 'OH-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 12, 'sku' => 'OH-L-B'],
                ],
            ],
            [
                'name' => 'Graphic Print Tee',
                'description' => 'Bold graphic t-shirt with artistic print. Premium cotton blend that stays vibrant wash after wash.',
                'price' => 699.00,
                'compare_at_price' => null,
                'category' => 'T-Shirts',
                'featured' => false,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop', 'alt' => 'Graphic Print Tee'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 15, 'sku' => 'GPT-S-W'],
                    ['size' => 'M', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 20, 'sku' => 'GPT-M-W'],
                    ['size' => 'L', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 10, 'sku' => 'GPT-L-W'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 2, 'sku' => 'GPT-M-B'],
                ],
            ],
            [
                'name' => 'Cargo Pants',
                'description' => 'Utility-inspired cargo pants with multiple pockets. Relaxed fit with adjustable ankle cuffs.',
                'price' => 1499.00,
                'compare_at_price' => null,
                'category' => 'Pants',
                'featured' => false,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&h=800&fit=crop', 'alt' => 'Cargo Pants'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 8, 'sku' => 'CP-S-O'],
                    ['size' => 'M', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 12, 'sku' => 'CP-M-O'],
                    ['size' => 'L', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 10, 'sku' => 'CP-L-O'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 0, 'sku' => 'CP-M-B'],
                ],
            ],
            [
                'name' => 'Denim Jacket',
                'description' => 'Classic denim jacket with timeless appeal. Medium wash with slight distressing for a lived-in look.',
                'price' => 1999.00,
                'compare_at_price' => 2499.00,
                'category' => 'Jackets',
                'featured' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop', 'alt' => 'Denim Jacket'],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Blue', 'color_hex' => '#4a90d9', 'stock' => 5, 'sku' => 'DJ-S-BL'],
                    ['size' => 'M', 'color' => 'Blue', 'color_hex' => '#4a90d9', 'stock' => 8, 'sku' => 'DJ-M-BL'],
                    ['size' => 'L', 'color' => 'Blue', 'color_hex' => '#4a90d9', 'stock' => 6, 'sku' => 'DJ-L-BL'],
                ],
            ],
        ];

        foreach ($products as $data) {
            $category = Category::where('name', $data['category'])->first();

            $product = Product::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'compare_at_price' => $data['compare_at_price'],
                'category_id' => $category->id,
                'featured' => $data['featured'],
                'status' => 'active',
            ]);

            foreach ($data['images'] as $i => $img) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $img['url'],
                    'alt' => $img['alt'],
                    'sort_order' => $i,
                ]);
            }

            foreach ($data['variants'] as $variant) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    ...$variant,
                ]);
            }
        }
    }
}
