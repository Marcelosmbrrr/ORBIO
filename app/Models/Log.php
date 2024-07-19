<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\ServiceOrder;
use App\Models\User;

class Log extends Model
{
    use HasFactory;

    protected $guarded = [];

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id");
    }

    // Scope

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query
                    ->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('filename', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }
}
