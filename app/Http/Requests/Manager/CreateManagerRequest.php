<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class CreateManagerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation()
    {
        if (! $this->filled('password')) {
            $this->merge([
                'password' => Str::random(10),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['sometimes'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'informe o nome',
            'email.required' => 'informe o e-mail',
            'email.email' => 'e-mail inválido',
            'email.unique' => 'e-mail já existe',
        ];
    }
}
