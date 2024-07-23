<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    public $table = 'equipments';

    protected $guarded = [];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, 'service_order_drone', 'drone_id');
    }

    // Scopes

    public function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('public_id', $value)
                ->orWhere('manufacturer', 'LIKE', '%'.$value.'%')
                ->orWhere('model', 'LIKE', '%'.$value.'%')
                ->orWhere('record_number', 'LIKE', '%'.$value.'%')
                ->orWhere('serial_number', 'LIKE', '%'.$value.'%')
                ->orWhere('weight', $value);
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
