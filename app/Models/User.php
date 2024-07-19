<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ServiceOrder;
use App\Models\FlightPlan;
use App\Models\Drone;
use App\Models\Battery;
use App\Models\Equipment;
use App\Models\Address;
use App\Models\Document;
use App\Models\Contact;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    function tenant()
    {
        if (in_array($this->role, ['gerente', 'piloto'])) {
            return $this->belongsTo(User::class, "user_id");
        }

        return null;
    }

    function users()
    {
        if ($this->role == 'gerente') {
            return $this->hasMany(User::class, "user_id");
        }

        return null;
    }

    function address()
    {
        return $this->hasOne(Address::class);
    }

    function contact()
    {
        return $this->hasOne(Contact::class);
    }

    function document()
    {
        return $this->hasOne(Document::class);
    }

    public function service_orders()
    {
        if ($this->role == 'gerente') {
            return $this->hasMany(ServiceOrder::class);
        } else if (in_array($this->role, ['piloto', 'cliente'])) {
            return $this->belongsToMany(ServiceOrder::class, 'service_order_user');
        }

        return null;
    }

    function flight_plans()
    {
        if (in_array($this->role, ['gerente', 'piloto'])) {
            return $this->hasMany(FlightPlan::class, "tenant_id");
        }

        return null;
    }

    function drones()
    {
        return $this->hasMany(Drone::class, "tenant_id");
    }

    function batteries()
    {
        return $this->hasMany(Battery::class, "tenant_id");
    }

    function equipment()
    {
        return $this->hasMany(Equipment::class, "tenant_id");
    }

    // Acessors and mutators

    public function getFirstNameAttribute(): string
    {
        return explode(" ", $this->name)[0];
    }

    // Scopes

    function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('users.public_id', $value)
                ->orWhere('users.name', 'LIKE', '%' . $value . '%')
                ->orWhere('users.email', 'LIKE', '%' . $value . '%');
        });
    }

    function scopeFilter($query, string $filter)
    {
        if ($filter === "verified") {
            return $query->where("email_verified_at", "!=", null)->where("deleted_at", null);
        } else if ($filter === "unverified") {
            return $query->where("email_verified_at", null)->where("deleted_at", null);
        } else if ($filter === "deleted") {
            return $query->onlyTrashed();
        }
    }
}
