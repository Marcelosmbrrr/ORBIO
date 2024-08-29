<?php

namespace App\Http\Resources\ServiceOrders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $situation = [];
        if ($this->situation === 'open') {
            $situation['name'] = 'Aberto';
            $situation['key'] = 'open';
        } elseif ($this->situation === 'approved') {
            $situation['name'] = 'Em atendimento';
            $situation['key'] = 'approved';
        } elseif ($this->situation === 'finished') {
            $situation['name'] = 'Finalizado';
            $situation['key'] = 'finished';
        } elseif ($this->situation === 'canceled') {
            $situation['name'] = 'Cancelado';
            $situation['key'] = 'canceled';
        }

        $pilot = 'Não Designado';
        $client = 'Não Designado';
        $attendant = $this->attendant()->exists() ? $this->attendant->name : '';

        foreach ($this->users as $user) {

            if ($user->pivot->role_in === 'pilot') {
                $pilot = $user->name;
            } elseif ($user->pivot->role_in === 'client') {
                $client = $user->name;
            }
        }

        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'situation' => $situation,
            'pilot' => $pilot,
            'client' => $client,
            'attendant' => $attendant,
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'deleted_at' => $this->deleted_at,
        ];
    }
}
