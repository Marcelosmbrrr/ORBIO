<?php

namespace App\Http\Controllers\Profile;

use App\Events\UserEmailUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Http\Requests\Profile\DeactivateAccountRequest;
use App\Http\Requests\Profile\EditAddressDataRequest;
use App\Http\Requests\Profile\EditBasicDataRequest;
use App\Http\Requests\Profile\EditContactDataRequest;
use App\Http\Requests\Profile\EditDocumentalDataRequest;
use App\Http\Resources\Profile\ProfileResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function index()
    {
        $user = $this->model->where('id', Auth::user()->id)->first();

        return Inertia::render('Authenticated/Profile/Index', [
            'profile' => new ProfileResource($user),
            'success' => session('success'),
        ]);
    }

    public function updateBasic(EditBasicDataRequest $request)
    {
        $user = $this->model->where('id', Auth::user()->id)->first();

        $email_changed = $user->email !== $request->email;

        $user->update($request->validated());

        if ($email_changed) {

            $user->update([
                'email_verified_at' => null,
            ]);

            event(new UserEmailUpdated($user));

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('success', 'O link de confirmação foi enviado para o seu e-mail.');
        }

        return redirect()->route('profile.index')
            ->with('success', 'Os dados básicos foram atualizados');
    }

    public function updateDocument(EditDocumentalDataRequest $request)
    {
        $data = array_filter($request->all(), function ($value) {
            return ! is_null($value);
        });

        $user = $this->model->find(Auth::user()->id);
        $user->profile->document()->update($data);

        return redirect()->route('profile.index')
            ->with('success', 'Os documentos foram atualizados');
    }

    public function updateAddress(EditAddressDataRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);
        $user->profile->address()->update($request->validated());

        return redirect()->route('profile.index')
            ->with('success', 'Os dados de endereço foram atualizados');
    }

    public function updateContact(EditContactDataRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);
        $user->profile->contact()->update($request->validated());

        return redirect()->route('profile.index')
            ->with('success', 'Os dados de contato foram atualizados');
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);

        $password_match = Hash::check($request->password, $user->password);

        if (! $password_match) {
            throw ValidationException::withMessages(['password' => 'Senha inválida']);
        }

        $user->profile->contact()->update([
            'password' => $request->new_password,
        ]);

        return redirect()->route('profile.index')
            ->with('success', 'Senha atualizada!');
    }

    public function deactivateAccount(DeactivateAccountRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);

        $password_match = Hash::check($request->password, $user->password);

        if (! $password_match) {
            throw ValidationException::withMessages(['password' => 'Senha inválida']);
        }

        $user->delete();
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::render('Guest/Login', [
            'success' => 'Sua conta foi desativada',
        ]);
    }
}
