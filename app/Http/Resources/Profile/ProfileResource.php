<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "field_control" => [
                "cnpj" => in_array(Auth::user()->role, ["gerente", "piloto", "cliente"]),
                "company_name" => in_array(Auth::user()->role, ["piloto", "cliente"]),
                "trading_name" => in_array(Auth::user()->role, ["piloto", "cliente"]),
                "license_anac" => in_array(Auth::user()->role, ["piloto"])
            ],
            "basic" => [
                "name" => $this->name,
                "email" => $this->email,
                "created_at" => $this->created_at->format('d/m/Y'),
                "update_at" => $this->updated_at->format('d/m/Y'),
                "role" => $this->role,
            ],
            "documents" => [
                "cpf" => (string) $this->profile->document->cpf,
                "cnpj" => (string) $this->profile->document->cnpj,
                "company_name" => (string) $this->profile->document->company_name,
                "trading_name" => (string) $this->profile->document->trading_name,
                "license_anac" => (string) $this->profile->document->anac_license
            ],
            "address" => [
                "zip_code" => (string) $this->profile->address->zip_code,
                "city" => (string) $this->profile->address->city,
                "state" => (string) $this->profile->address->state,
                "neighborhood" => (string) $this->profile->address->neighborhood,
                "street_name" => (string) $this->profile->address->street_name,
                "number" => (string) $this->profile->address->number
            ],
            "contact" => [
                "phone_number" => (string) $this->profile->contact->phone_number,
                "ddd" => (string) $this->profile->contact->ddd,
            ]
        ];
    }
}
