<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'password' => ['required'],
            'new_password' => ['required'],
        ];
    }

    public function messages()
    {
        return [
            'password.required' => 'Informe a senha atual',
            'new_password.required' => 'Informe a nova senha',
        ];
    }
}
