<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\User;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, string $id): RedirectResponse
    {
        if (!$request->hasValidSignature()) {
            return redirect()->route('login')->with('error', 'Link de verificação inválido');
        }

        $user = User::where("public_id", $id)->first();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('error', 'O e-mail já foi verificado');
        }

        if ($user->markEmailAsVerified()) {
            return redirect()->route('login')->with('success', 'E-mail verificado com sucesso');
        }
    }
}
