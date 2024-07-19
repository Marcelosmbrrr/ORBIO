<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $auth = [];

        if (Auth::check()) {

            $user_role = Auth::user()->role;

            $authorization["managers"] = [
                "read" => $user_role === "admin",
                "write" => $user_role === "admin"
            ];

            $authorization["users"] = [
                "read" => $user_role === "gerente",
                "write" => $user_role === "gerente"
            ];

            $authorization["flightplans"] = [
                "read" => $user_role === "gerente" || $user_role === "piloto",
                "write" => $user_role === "gerente" || $user_role === "piloto",
            ];

            $authorization["serviceorders"] = [
                "read" => $user_role != "admin",
                "create" => $user_role === "gerente",
                "edit" => $user_role === "piloto"
            ];

            $authorization["equipments"] = [
                "read" => $user_role === "gerente" || $user_role === "piloto",
                "write" => $user_role === "gerente" || $user_role === "piloto",
            ];

            $auth = [
                "user" => [
                    "id" => Auth::user()->public_id,
                    "name" => Auth::user()->first_name,
                    "role" => $user_role,
                    "authorization" => $authorization
                ]
            ];
        }

        return [
            ...parent::share($request),
            'auth' => $auth,
        ];
    }
}
