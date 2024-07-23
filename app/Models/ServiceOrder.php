<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ServiceOrder extends Model
{
    use HasFactory;

    public $table = 'service_orders';

    protected $guarded = [];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'service_order_user')->withPivot('role_in')->withTrashed();
    }

    public function pilot()
    {
        return $this->belongsToMany(User::class, 'service_order_user')
            ->wherePivot('role_in', 'pilot')->withTrashed();
    }

    public function client()
    {
        return $this->belongsToMany(User::class, 'service_order_user')
            ->wherePivot('role_in', 'client')->withTrashed();
    }

    public function attendant()
    {
        return $this->belongsTo(User::class, 'attendant_id')->withTrashed();
    }

    public function flight_plans()
    {
        return $this->belongsToMany(FlightPlan::class, 'service_order_flight_plan')->withTrashed();
    }

    public function logs()
    {
        return $this->hasMany(Log::class, 'service_order_id');
    }

    public function drones()
    {
        return $this->belongsToMany(Drone::class, 'service_order_drone')->withTrashed();
    }

    public function batteries()
    {
        return $this->belongsToMany(Battery::class, 'service_order_battery')->withTrashed();
    }

    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'service_order_equipment')->withTrashed();
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'service_order_id', 'id');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'service_order_id', 'id');
    }

    // Scope

    public function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('public_id', $value)
                ->orWhere('name', 'LIKE', '%'.$value.'%');
        });
    }

    public function scopeFilter($query, string $filter)
    {
        $is_pilot = Auth::user()->role === 'piloto';
        $is_client = Auth::user()->role === 'cliente';
        $is_tenant = Auth::user()->role === 'gerente';

        if ($is_tenant) {
            return $query->when($filter != 'all', function ($query) use ($filter) {
                $query->where('situation', $filter);
            });
        }

        if ($is_client) {

            return $query->whereHas('client', function ($query) {
                $query->where('user_id', Auth::user()->id);
            })->when($filter != 'all', function ($query) use ($filter) {
                $query->where('situation', $filter);
            });
        }

        if ($is_pilot) {

            if ($filter === 'all') {

                return $query->where(function ($query) {
                    $query->where('situation', 'open')
                        ->where(function ($query) {
                            $query->whereHas('pilot', function ($query) {
                                $query->where('user_id', Auth::user()->id);
                            })->orDoesntHave('pilot');
                        });
                })->orWhere(function ($query) {
                    $query->where('situation', '!=', 'open')
                        ->whereHas('attendant', function ($query) {
                            $query->where('attendant_id', Auth::user()->id);
                        });
                });
            } elseif ($filter === 'open') {

                return $query->where('situation', 'open')
                    ->where(function ($query) {
                        $query->whereHas('pilot', function ($query) {
                            $query->where('user_id', Auth::user()->id);
                        })->orDoesntHave('pilot');
                    });
            } else {

                return $query->where('situation', $filter)->whereHas('attendant', function ($subquery) {
                    $subquery->where('attendant_id', Auth::user()->id);
                });
            }
        }
    }
}
