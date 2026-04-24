<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Classic White Teee',
                'slug' => 'classic-white-teee',
                'description' => 'A timeless white t-shirt made from 100% organic cotton',
                'price' => 599.00,
                'compare_at_price' => 799.00,
                'category_id' => 1,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 'alt' => 'Classic White Tee front', 'sort_order' => 0],
                    ['url' => 'https://images.unsplash.com/photo-1622445275576-721429aa7e1a?w=500&h=500&fit=crop', 'alt' => 'Classic White Tee back', 'sort_order' => 1],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 6, 'sku' => 'CWT-S-W'],
                    ['size' => 'L', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 10, 'sku' => 'CWT-L-W'],
                    ['size' => 'XL', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 10, 'sku' => 'CWT-XL-W'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 17, 'sku' => 'CWT-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 12, 'sku' => 'CWT-L-B'],
                ]
            ],
            [
                'name' => 'Slim Fit Jeans',
                'slug' => 'slim-fit-jeans',
                'description' => 'Modern slim-fit jeans crafted from premium stretch denim',
                'price' => 1299.00,
                'compare_at_price' => null,
                'category_id' => 2,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=500&fit=crop', 'alt' => 'Slim Fit Jeans front', 'sort_order' => 0],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 10, 'sku' => 'SFJ-S-N'],
                    ['size' => 'M', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 14, 'sku' => 'SFJ-M-N'],
                    ['size' => 'L', 'color' => 'Navy', 'color_hex' => '#1e3a5f', 'stock' => 12, 'sku' => 'SFJ-L-N'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 8, 'sku' => 'SFJ-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 6, 'sku' => 'SFJ-L-B'],
                ]
            ],
            [
                'name' => 'Urban Bomber Jacket',
                'slug' => 'urban-bomber-jacket',
                'description' => 'Sleek bomber jacket with a modern edge. Water-resistant.',
                'price' => 2499.00,
                'compare_at_price' => 2999.00,
                'category_id' => 3,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'Urban Bomber Jacket', 'sort_order' => 0],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 7, 'sku' => 'UBJ-S-B'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 10, 'sku' => 'UBJ-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 10, 'sku' => 'UBJ-L-B'],
                    ['size' => 'M', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 10, 'sku' => 'UBJ-M-O'],
                    ['size' => 'L', 'color' => 'Olive', 'color_hex' => '#556b2f', 'stock' => 10, 'sku' => 'UBJ-L-O'],
                ]
            ],
            [
                'name' => 'Floral Summer Dress',
                'slug' => 'floral-summer-dress',
                'description' => 'Light and breezy floral dress perfect for warm weather',
                'price' => 1599.00,
                'compare_at_price' => null,
                'category_id' => 4,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1595777457583-95e058d6b451?w=500&h=500&fit=crop', 'alt' => 'Floral Summer Dress', 'sort_order' => 0],
                ],
                'variants' => [
                    ['size' => 'XS', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 6, 'sku' => 'FSD-XS-BG'],
                    ['size' => 'S', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 10, 'sku' => 'FSD-S-BG'],
                    ['size' => 'M', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 7, 'sku' => 'FSD-M-BG'],
                    ['size' => 'L', 'color' => 'Beige', 'color_hex' => '#d4a574', 'stock' => 8, 'sku' => 'FSD-L-BG'],
                ]
            ],
            [
                'name' => 'Oversized Hoodie',
                'slug' => 'oversized-hoodie',
                'description' => 'Super comfortable oversized hoodie in thick fleece',
                'price' => 1199.00,
                'compare_at_price' => 1499.00,
                'category_id' => 5,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', 'alt' => 'Oversized Hoodie', 'sort_order' => 0],
                ],
                'variants' => [
                    ['size' => 'M', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 19, 'sku' => 'OH-M-G'],
                    ['size' => 'L', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 15, 'sku' => 'OH-L-G'],
                    ['size' => 'XL', 'color' => 'Gray', 'color_hex' => '#6b7280', 'stock' => 10, 'sku' => 'OH-XL-G'],
                    ['size' => 'M', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 18, 'sku' => 'OH-M-B'],
                    ['size' => 'L', 'color' => 'Black', 'color_hex' => '#000000', 'stock' => 12, 'sku' => 'OH-L-B'],
                ]
            ],
            [
                'name' => 'Graphic Print Tee',
                'slug' => 'graphic-print-tee',
                'description' => 'Bold graphic t-shirt with artistic print. Premium quality.',
                'price' => 699.00,
                'compare_at_price' => null,
                'category_id' => 1,
                'featured' => 0,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1503342217505-b0a15364e622?w=500&h=500&fit=crop', 'alt' => 'Graphic Print Tee', 'sort_order' => 0],
                ],
                'variants' => [
                    ['size' => 'S', 'color' => 'White', 'color_hex' => '#FFFFFF', 'stock' => 15, 'sku' => 'GPT-S-W'],
                ]
            ],
            [
                'name' => 'Cargo Pants',
                'slug' => 'cargo-pants',
                'description' => 'Utility-inspired cargo pants with multiple pockets',
                'price' => 1499.00,
                'compare_at_price' => null,
                'category_id' => 2,
                'featured' => 0,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1517438476312-10841e8e5f65?w=500&h=500&fit=crop', 'alt' => 'Cargo Pants', 'sort_order' => 0],
                ],
                'variants' => []
            ],
            [
                'name' => 'Denim Jacket',
                'slug' => 'denim-jacket',
                'description' => 'Classic denim jacket with timeless appeal. Medium wash.',
                'price' => 1999.00,
                'compare_at_price' => 2499.00,
                'category_id' => 3,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop', 'alt' => 'Denim Jacket', 'sort_order' => 0],
                ],
                'variants' => []
            ],
            [
                'name' => 'blue shark school jacket',
                'slug' => 'blue-shark-school-jacket',
                'description' => 'high quality shark school jacket in blue',
                'price' => 455.12,
                'compare_at_price' => 600.11,
                'category_id' => 1,
                'featured' => 0,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'blue shark school jacket', 'sort_order' => 0],
                ],
                'variants' => []
            ],
            [
                'name' => 'whitish scott street',
                'slug' => 'whitish-scott-street',
                'description' => 'whitish style bisan init',
                'price' => 500.00,
                'compare_at_price' => 999.99,
                'category_id' => 3,
                'featured' => 0,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'whitish scott street', 'sort_order' => 0],
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'whitish scott street', 'sort_order' => 1],
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'whitish scott street', 'sort_order' => 2],
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'alt' => 'whitish scott street', 'sort_order' => 3],
                ],
                'variants' => []
            ],
            [
                'name' => 'red handeld sweet',
                'slug' => 'red-handeld-sweet',
                'description' => 'a fresh running cloth',
                'price' => 50.00,
                'compare_at_price' => 100.00,
                'category_id' => 1,
                'featured' => 1,
                'status' => 'active',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 'alt' => 'red handeld sweet', 'sort_order' => 0],
                ],
                'variants' => []
            ],
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            $variants = $productData['variants'];
            unset($productData['images'], $productData['variants']);

            $product = Product::create($productData);

            foreach ($images as $image) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $image['url'],
                    'alt' => $image['alt'],
                    'sort_order' => $image['sort_order'],
                ]);
            }

            foreach ($variants as $variant) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $variant['size'],
                    'color' => $variant['color'],
                    'color_hex' => $variant['color_hex'],
                    'stock' => $variant['stock'],
                    'sku' => $variant['sku'],
                ]);
            }
        }
    }
}
