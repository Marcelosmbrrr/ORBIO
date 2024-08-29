<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PilotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => [
                'value' => (bool) $this->email_verified_at,
                'title' => $this->trashed() ? 'Deletado' : ((bool) $this->email_verified_at ? 'Verificado' : 'Não Verificado'),
                'style_key' => $this->trashed() ? 'deleted' : ((bool) $this->email_verified_at ? 'verified' : 'unverified'),
            ],
            $this->mergeWhen($request->routeIs('clients.show'), [
                'service-orders' => []
            ]),
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'deleted_at' => $this->deleted_at,
        ];
    }
}
