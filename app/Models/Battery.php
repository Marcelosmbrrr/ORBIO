<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ServiceOrder;
use App\Models\User;

class Battery extends Model
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
                ->where('batteries.public_id', $value)
                ->orWhere('name', 'LIKE', '%' . $value . '%')
                ->orWhere('manufacturer', 'LIKE', '%' . $value . '%')
                ->orWhere('model', 'LIKE', '%' . $value . '%')
                ->orWhere('serial_number', 'LIKE', '%' . $value . '%');
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
