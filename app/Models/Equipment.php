<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ServiceOrder;
use App\Models\User;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function tenant()
    {
        return $this->belongsTo(User::class, "tenant_id");
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_drone", "drone_id");
    }

    // Scopes

    function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('equipments.public_id', $value)
                ->orWhere('manufacturer', 'LIKE', '%' . $value . '%')
                ->orWhere('model', 'LIKE', '%' . $value . '%')
                ->orWhere('record_number', 'LIKE', '%' . $value . '%')
                ->orWhere('serial_number', 'LIKE', '%' . $value . '%')
                ->orWhere('weight', $value);
        });
    }

    function scopeFilter($query, string $filter)
    {
        if ($filter === "all") {
            return $query->withTrashed();
        } else if ($filter === "active") {
            return $query->where("deleted_at", null);
        } else if ($filter === "deleted") {
            return $query->onlyTrashed();
        }
    }
}
