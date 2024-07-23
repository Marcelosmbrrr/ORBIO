<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlightPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, 'service_order_flight_plan', 'flight_plan_id', 'service_order_id');
    }

    // Scopes

    public function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('public_id', $value)
                ->orWhere('name', 'LIKE', '%'.$value.'%')
                ->orWhere('city', 'LIKE', '%'.$value.'%')
                ->orWhere('state', 'LIKE', '%'.$value.'%');
        });
    }

    public function scopeFilter($query, string $filter)
    {
        if ($filter === 'all') {
            return $query->withTrashed();
        } elseif ($filter === 'active') {
            return $query->where('deleted_at', null);
        } elseif ($filter === 'deleted') {
            return $query->onlyTrashed();
        }
    }
}
