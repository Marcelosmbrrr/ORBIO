<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\Profile\EditBasicDataRequest;
use App\Http\Requests\Profile\EditDocumentalDataRequest;
use App\Http\Requests\Profile\EditAddressDataRequest;
use App\Http\Requests\Profile\EditContactDataRequest;
use App\Http\Requests\Profile\DeactivateAccountRequest;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Http\Resources\Profile\ProfileResource;

class ProfileController extends Controller
{
    function __construct(User $model)
    {
        $this->model = $model;
    }

    public function index()
    {
        $user = $this->model->where("id", Auth::user()->id)->first();

        return Inertia::render("Authenticated/Profile/Index", [
            "profile" => new ProfileResource($user),
            "success" => session('success')
        ]);
    }

    public function updateBasic(EditBasicDataRequest $request)
    {
        $user = $this->model->where("id", Auth::user()->id)->first();
        $user->update($request->validated());

        return redirect()->route('profile.index')
            ->with('success', "Os dados básicos foram atualizados");
    }

    function updateDocument(EditDocumentalDataRequest $request)
    {
        $data = array_filter($request->all(), function ($value) {
            return !is_null($value);
        });

        $user = $this->model->find(Auth::user()->id);
        $user->profile->document()->update($data);

        return redirect()->route('profile.index')
            ->with('success', "Os documentos foram atualizados");
    }

    function updateAddress(EditAddressDataRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);
        $user->profile->address()->update($request->validated());

        return redirect()->route('profile.index')
            ->with('success', "Os dados de endereço foram atualizados");
    }

    function updateContact(EditContactDataRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);
        $user->profile->contact()->update($request->validated());

        return redirect()->route('profile.index')
            ->with('success', "Os dados de contato foram atualizados");
    }

    function updatePassword(ChangePasswordRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);

        $password_match = Hash::check($request->password, $user->password);

        if (!$password_match) {
            throw ValidationException::withMessages(['password' => 'Senha inválida']);
        }

        $user->profile->contact()->update([
            'password' => $request->new_password
        ]);

        return redirect()->route('profile.index')
            ->with('success', "Senha atualizada!");
    }

    function deactivateAccount(DeactivateAccountRequest $request)
    {
        $user = $this->model->find(Auth::user()->id);

        $password_match = Hash::check($request->password, $user->password);

        if (!$password_match) {
            throw ValidationException::withMessages(['password' => 'Senha inválida']);
        }

        $user->delete();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::render("Guest/Login", [
            "success" => "Conta desativada!",
        ]);
    }
}
