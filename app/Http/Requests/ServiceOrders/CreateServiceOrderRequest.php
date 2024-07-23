<?php

namespace App\Http\Requests\ServiceOrders;

use Illuminate\Foundation\Http\FormRequest;

class CreateServiceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client' => ['sometimes', 'array', 'max:1'],
            'pilot' => ['sometimes', 'array', 'max:1'],
            'flightplans' => ['required', 'array', 'min:1'],
            'drones' => ['sometimes', 'array'],
            'batteries' => ['sometimes', 'array'],
            'equipments' => ['sometimes', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'client.array' => 'Cliente deve ser um array.',
            'client.max' => 'No máximo 1 cliente.',
            'pilot.array' => 'Piloto deve ser um array.',
            'pilot.max' => 'No máximo 1 piloto.',
            'flightplans.array' => 'Planos de voo deve ser um array',
            'flightplans.min' => 'Selecione pelo menos um plano de voo',
            'drones.array' => 'Drones deve ser um array',
            'batteries.array' => 'Baterias deve ser um array',
            'equipments.array' => 'Equipamentos deve ser um array',
        ];
    }
}
