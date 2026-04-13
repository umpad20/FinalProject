<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'compare_at_price',
        'category_id', 'featured', 'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'featured' => 'boolean',
        ];
    }

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getSizesAttribute(): array
    {
        return $this->variants->pluck('size')->unique()->values()->toArray();
    }

    public function getColorsAttribute(): array
    {
        return $this->variants->unique('color')->map(fn ($v) => [
            'name' => $v->color,
            'hex' => $v->color_hex,
        ])->values()->toArray();
    }

    public function getTotalStockAttribute(): int
    {
        return $this->variants->sum('stock');
    }

    public function getReservedStockAttribute(): int
    {
        return OrderItem::whereIn('product_variant_id', $this->variants->pluck('id'))
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['pending', 'processing']);
            })
            ->sum('quantity');
    }

    public function getAvailableStockAttribute(): int
    {
        return $this->total_stock - $this->reserved_stock;
    }

    public function getIsNewAttribute(): bool
    {
        return $this->created_at >= now()->subDays(7);
    }
    public function favoritedBy(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites', 'product_id', 'user_id')->withTimestamps();
    }
}
