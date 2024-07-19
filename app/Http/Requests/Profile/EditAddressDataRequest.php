<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class EditAddressDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "zip_code" => ["required"],
            "state" => ["required"],
            "city" => ["required"],
            "neighborhood" => ["required"],
            "street_name" => ["required"],
            "number" => ["required"]
        ];
    }

    public function messages()
    {
        return [
            "zip_code.required" => "Informe o cep",
            "state.required" => "Informe a uf",
            "city.required" => "Informe a cidade",
            "neighborhood.required" => "Informe o bairro",
            "street_name" => "Informe o logradouro",
            "number.required" => "Informe o número"
        ];
    }
}
