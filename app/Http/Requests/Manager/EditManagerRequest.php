<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class EditManagerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $public_id = $this->route('manager');

        $rules = [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email,'.$public_id.',public_id'],
        ];

        if ($this->filled('password')) {
            $rules['password'] = ['sometimes'];
        }

        return $rules;
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
