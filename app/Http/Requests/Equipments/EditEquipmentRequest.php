<?php

namespace App\Http\Requests\Equipments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $equipment_id = $this->route('equipment');

        $uniqueRule = Rule::unique('equipments')
            ->where('tenant_id', session('tenant_id'))
            ->ignore($equipment_id, 'public_id');

        return [
            'name' => ['required', $uniqueRule],
            'manufacturer' => ['required'],
            'model' => ['required'],
            'record_number' => ['required'],
            'serial_number' => ['required'],
            'weight' => ['required'],
            'image' => ['nullable', 'image', 'dimensions:min_height=300, max_height=600, max_width=600'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'informe o nome do equipamento',
            'name.unique' => 'Já existe um equipamento com esse nome',
            'manufacturer.required' => 'informe o fabricante',
            'record_number.required' => 'informe o número de registro',
            'serial_number.required' => 'informe o número serial',
            'weight.required' => 'informe o peso',
        ];
    }
}
