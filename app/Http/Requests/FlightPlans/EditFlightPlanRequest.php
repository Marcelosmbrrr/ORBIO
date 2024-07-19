<?php

namespace App\Http\Requests\FlightPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditFlightPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $flight_plan_id = $this->route("flight_plan");

        $uniqueRule = Rule::unique('flight_plans')
            ->where('tenant_id', session('tenant_id'))
            ->ignore($flight_plan_id);

        return [
            "name" => ["required", $uniqueRule],
            "image" => ["required", "image"],
            "single_file" => ["required", "file", "mimes:txt"],
            "multi_file" => ["required", "array"],
            'multi_file.*' => ["file", "mimes:txt"]
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
            'name.unique' => 'Esse nome já existe.',

            'single_file.required' => 'O arquivo em formato único deve ser enviado.',
            'single_file.file' => 'O arquivo em formato único é inválido.',
            'single_file.mimes' => 'O arquivo em formato único deve ser um arquivo do tipo: txt.',

            'multi_file.required' => 'O arquivo em formato múltiplo deve ser enviado.',
            'multi_file.array' => 'O arquivo em formato múltiplo deve ser um array.',
            'multi_file.*.file' => 'O arquivo em formato múltiplo é inválido.',
            'multi_file.*.mimes' => 'Cada arquivo do formato múltiplo deve ser um arquivo do tipo: txt.',
        ];
    }
}
