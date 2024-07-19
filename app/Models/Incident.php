<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ServiceOrder;

class Incident extends Model
{
    use HasFactory;

    protected $guarded = [];

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id");
    }
}
