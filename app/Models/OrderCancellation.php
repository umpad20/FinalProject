<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderCancellation extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'reason_category',
        'reason',
        'admin_notes',
        'cancelled_at',
        'deducted_amount',
    ];

    protected function casts(): array
    {
        return [
            'cancelled_at' => 'datetime',
            'deducted_amount' => 'decimal:2',
        ];
    }

    public function order(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
