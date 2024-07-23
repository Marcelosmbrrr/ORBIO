<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class EditDocumentalDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cpf' => 'required|string|regex:^\d{3}\.\d{3}\.\d{3}-\d{2}$^',
            'cnpj' => 'nullable|string|regex:^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$^',
            'company_name' => 'nullable|string|max:255',
            'trading_name' => 'nullable|string|max:255',
            'anac_license' => 'nullable|string|^\d{6}$^',
        ];
    }

    public function messages()
    {
        return [
            'cpf.required' => 'Informe o cpf',
            'cnpj.required' => 'Informe o cnpj',
            'cpf.regex' => 'Formato inválido',
            'cnpj.regex' => 'Formato inválido',
            'anac_license.regex' => 'Formato inválido',
        ];
    }
}
