<?php

namespace App\Http\Requests\ServiceOrders;

use Illuminate\Foundation\Http\FormRequest;

class EditServiceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'situation' => ['nullable', 'string'],
        ];

        if ($this->input('situation') === 'canceled') {
            $rules['observation'] = ['required', 'min:10', 'max:255'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'observation.required' => 'Informe a justificativa',
            'observation.min' => 'Deve ter no mínimo 10 caracteres',
        ];
    }
}
