<?php

namespace App\Http\Requests\Logs;

use Illuminate\Foundation\Http\FormRequest;

class CreateLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "logs" => ["required", 'array'],
            "logs.*" => ["file", "extensions:kml"],
        ];
    }
}
