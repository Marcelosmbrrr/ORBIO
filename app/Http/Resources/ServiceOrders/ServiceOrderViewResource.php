<?php

namespace App\Http\Resources\ServiceOrders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceOrderViewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $situation = [];
        if ($this->situation === "open") {
            $situation["name"] = "Aberto";
            $situation["key"] = "open";
        } else if ($this->situation === "approved") {
            $situation["name"] = "Em Atendimento";
            $situation["key"] = "approved";
        } else if ($this->situation === "finished") {
            $situation["name"] = "Finalizado";
            $situation["key"] = "finished";
        } else if ($this->situation === "canceled") {
            $situation["name"] = "Cancelado";
            $situation["key"] = "canceled";
        }

        $pilot = "Sem Piloto";
        $client = "Sem Cliente";
        $attendant = $this->attendant()->exists() ? $this->attendant->name : "Nenhum";

        foreach ($this->users as $user) {
            if ($user->pivot->role_in === "pilot") {
                $pilot = $user->name;
            } else if ($user->pivot->role_in === "client") {
                $client = $user->name;
            }
        }

        return [
            "id" => $this->public_id,
            "name" => $this->name,
            "situation" => $situation,
            "pilot" => $pilot,
            "client" => $client,
            "attendant" => $attendant,
            "observation" => $this->observation,
            "created_at" => $this->created_at->format('d/m/Y'),
            "updated_at" => $this->updated_at->format('d/m/Y'),
            "deleted_at" => $this->deleted_at
        ];
    }
}
