<?php

namespace App\Http\Requests\Batteries;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditBatteryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $battery_id = $this->route('battery');

        $uniqueRule = Rule::unique('batteries')
            ->where('tenant_id', session('tenant_id'))
            ->ignore($battery_id, 'public_id');

        return [
            'name' => ['required', $uniqueRule],
            'manufacturer' => ['required'],
            'model' => ['required'],
            'serial_number' => ['required'],
            'last_charge' => ['required'],
            'image' => ['nullable', 'image', 'dimensions:min_height=300, max_height=600, max_width=600'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'informe o nome da bateria',
            'name.unique' => 'Já existe uma bateria com esse nome',
            'manufacturer.required' => 'informe o fabricante',
            'serial_number.required' => 'informe o número serial',
            'last_charge.required' => 'informe a data da última carga',
        ];
    }
}
