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
    public function __invoke(Request $request): RedirectResponse
    {
        /*if (!$request->hasValidSignature()) {
            return redirect()->route('login')->with('error', 'Link de confirmação inválido');
        }*/

        $user = User::withTrashed()->where('public_id', $request->route('id'))->first();

        if (is_null($user)) {
            return redirect()->route('login')->with('error', 'Usuário não encontrado.');
        }

        if(!is_null($user->deleted_at)) {
            return redirect()->route('login')->with('error', 'O e-mail pertence a uma conta desativada');
        }
    
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('error', 'O e-mail já foi confirmado');
        }
    
        if ($user->markEmailAsVerified()) {
            return redirect()->route('login')->with('success', 'O e-mail foi confirmado');
        }
    }
}
