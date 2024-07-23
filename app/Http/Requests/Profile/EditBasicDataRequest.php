<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class EditBasicDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user_id = Auth::user()->id;

        return [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email,'.$user_id],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Informe o nome',
            'email.required' => 'Informe o e-mail',
            'email.unique' => 'Esse e-mail já existe',
        ];
    }
}
