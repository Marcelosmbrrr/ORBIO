<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
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

    public function tenant()
    {
        if (in_array($this->role, ['gerente', 'piloto'])) {
            return $this->belongsTo(User::class, 'user_id');
        }

        return null;
    }

    public function users()
    {
        if ($this->role == 'gerente') {
            return $this->hasMany(User::class, 'user_id');
        }

        return null;
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function contact()
    {
        return $this->hasOne(Contact::class);
    }

    public function document()
    {
        return $this->hasOne(Document::class);
    }

    public function service_orders()
    {
        if ($this->role == 'gerente') {
            return $this->hasMany(ServiceOrder::class);
        } elseif (in_array($this->role, ['piloto', 'cliente'])) {
            return $this->belongsToMany(ServiceOrder::class, 'service_order_user');
        }

        return null;
    }

    public function flight_plans()
    {
        if (in_array($this->role, ['gerente', 'piloto'])) {
            return $this->hasMany(FlightPlan::class, 'tenant_id');
        }

        return null;
    }

    public function drones()
    {
        return $this->hasMany(Drone::class, 'tenant_id');
    }

    public function batteries()
    {
        return $this->hasMany(Battery::class, 'tenant_id');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'tenant_id');
    }

    // Acessors and mutators

    public function getFirstNameAttribute(): string
    {
        return explode(' ', $this->name)[0];
    }

    // Scopes

    public function scopeSearch($query, $value)
    {
        return $query->when((bool) $value, function ($query) use ($value) {
            $query
                ->where('users.public_id', $value)
                ->orWhere('users.name', 'LIKE', '%'.$value.'%')
                ->orWhere('users.email', 'LIKE', '%'.$value.'%');
        });
    }

    public function scopeFilter($query, string $filter)
    {
        if ($filter === 'verified') {
            return $query->where('email_verified_at', '!=', null)->where('deleted_at', null);
        } elseif ($filter === 'unverified') {
            return $query->where('email_verified_at', null)->where('deleted_at', null);
        } elseif ($filter === 'deleted') {
            return $query->onlyTrashed();
        }
    }
}
