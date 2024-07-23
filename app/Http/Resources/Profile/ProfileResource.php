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
            'field_control' => [
                'cnpj' => in_array(Auth::user()->role, ['gerente', 'piloto', 'cliente']),
                'company_name' => in_array(Auth::user()->role, ['piloto', 'cliente']),
                'trading_name' => in_array(Auth::user()->role, ['piloto', 'cliente']),
                'license_anac' => in_array(Auth::user()->role, ['piloto']),
            ],
            'basic' => [
                'name' => $this->name,
                'email' => $this->email,
                'created_at' => $this->created_at->format('d/m/Y'),
                'update_at' => $this->updated_at->format('d/m/Y'),
                'role' => $this->role,
            ],
            'documents' => [
                'cpf' => (string) $this->document->cpf,
                'cnpj' => (string) $this->document->cnpj,
                'company_name' => (string) $this->document->company_name,
                'trading_name' => (string) $this->document->trading_name,
                'license_anac' => (string) $this->document->anac_license,
            ],
            'address' => [
                'zip_code' => (string) $this->address->zip_code,
                'city' => (string) $this->address->city,
                'state' => (string) $this->address->state,
                'neighborhood' => (string) $this->address->neighborhood,
                'street_name' => (string) $this->address->street_name,
                'number' => (string) $this->address->number,
            ],
            'contact' => [
                'number' => (string) $this->contact->number,
                'ddd' => (string) $this->contact->ddd,
            ],
        ];
    }
}
