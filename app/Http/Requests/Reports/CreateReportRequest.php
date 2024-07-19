<?php

namespace App\Http\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class CreateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["required", "min:3", "max:255"],
            "report" => ["required", "file", "mimes:pdf"]
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "O campo nome é obrigatório.",
            "name.string" => "O campo nome deve ser uma string."
        ];
    }
}
