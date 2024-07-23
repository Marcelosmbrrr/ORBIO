<?php

namespace App\Http\Requests\Pilots;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class CreatePilotRequest extends FormRequest
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
            'name.required' => 'Informe o nome',
            'email.email' => 'Email inválido',
            'email.unique' => 'E-mail já existe',
        ];
    }
}
