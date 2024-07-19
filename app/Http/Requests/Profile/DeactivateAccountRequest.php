<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class DeactivateAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "password" => ["required"],
        ];
    }

    public function messages()
    {
        return [
            "password.required" => "Informe a senha"
        ];
    }
}
