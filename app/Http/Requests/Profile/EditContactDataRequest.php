<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class EditContactDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "ddd" => ["required"],
            "phone_number" => ["required", "regex:^9?\d{8}$^"]
        ];
    }

    public function messages()
    {
        return [
            "ddd.required" => "Informe o ddd",
            "phone_number.required" => "Informe o número do telefone",
            "phone_number.regex" => "Formato inválido"
        ];
    }
}
