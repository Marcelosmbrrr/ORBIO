<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // === USERS === //

        Gate::define("managers:read", function ($user = null): bool {
            return Auth::user()->role === "admin";
        });

        Gate::define("managers:write", function ($user = null): bool {
            return Auth::user()->role === "admin";
        });

        Gate::define("pilots-clients:read", function ($user = null): bool {
            return Auth::user()->role === "gerente";
        });

        Gate::define("pilots-clients:write", function ($user = null): bool {
            return Auth::user()->role === "gerente";
        });

        // === FLIGHT PLANS === //

        Gate::define("flight-plans:read", function ($user = null): bool {
            return Auth::user()->role === "gerente" || Auth::user()->role === "piloto";
        });

        Gate::define("flight-plans:write", function ($user = null): bool {
            return Auth::user()->role === "gerente" || Auth::user()->role === "piloto";
        });

        // === SERVICE ORDERS === //

        Gate::define("service-orders:read", function ($user = null): bool {
            return Auth::user()->role != "admin";
        });

        Gate::define("service-orders:create", function ($user = null): bool {
            return Auth::user()->role === "gerente";
        });

        Gate::define("service-orders:edit", function ($user = null): bool {
            return Auth::user()->role === "piloto";
        });

        // === EQUIPMENTS === //

        Gate::define("equipments:read", function ($user = null): bool {
            return Auth::user()->role === "gerente" || Auth::user()->role === "piloto";
        });

        Gate::define("equipments:write", function ($user = null): bool {
            return Auth::user()->role === "gerente" || Auth::user()->role === "piloto";
        });
    }
}
