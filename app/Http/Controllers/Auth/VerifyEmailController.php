<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, string $id): RedirectResponse
    {
        /*if (!$request->hasValidSignature()) {
            return redirect()->route('login')->with('error', 'Link de confirmação inválido');
        }*/

        $user = User::where('public_id', $id)->first();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('error', 'O e-mail já foi confirmado');
        }

        if ($user->markEmailAsVerified()) {
            return redirect()->route('login')->with('success', 'O e-mail foi confirmado');
        }
    }
}
