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
        $user_id = $this->route("tenant");

        $rules = [
            "name" => ["required"],
            "email" => ["required", "email", "unique:users,email," . $user_id]
        ];

        if ($this->filled('password')) {
            $rules['password'] = ["sometimes"];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome",
            "email.email" => "e-mail inválido",
            "email.unique" => "e-mail já existe"
        ];
    }
}
