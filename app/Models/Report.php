<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, 'service_order_id', 'id');
    }

    // Scope

    public function scopeFilterByUser($query)
    {
        return $query->whereHas('service_order', function ($query) {
            $query->whereHas('users', function ($query) {
                $query->where('user_id', Auth::user()->id);
            });
        });
    }

    public function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query
                    ->where('name', 'LIKE', '%'.$value_searched.'%');
            }
        });
    }
}
