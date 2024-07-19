<?php

namespace App\Http\Requests\Clients;

use Illuminate\Foundation\Http\FormRequest;

class EditClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user_id = $this->route("client");

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
            "name.required" => "Informe o nome",
            "email.email" => "Email inválido",
            "email.unique" => "E-mail já existe"
        ];
    }
}
