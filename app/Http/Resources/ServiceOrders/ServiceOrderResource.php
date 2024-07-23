<?php

namespace App\Http\Resources\ServiceOrders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServiceOrderResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($service_order) {

            $situation = [];
            if ($service_order->situation === 'open') {
                $situation['name'] = 'Aberto';
                $situation['key'] = 'open';
            } elseif ($service_order->situation === 'approved') {
                $situation['name'] = 'Em atendimento';
                $situation['key'] = 'approved';
            } elseif ($service_order->situation === 'finished') {
                $situation['name'] = 'Finalizado';
                $situation['key'] = 'finished';
            } elseif ($service_order->situation === 'canceled') {
                $situation['name'] = 'Cancelado';
                $situation['key'] = 'canceled';
            }

            $pilot = 'Não Designado';
            $client = 'Não Designado';
            $attendant = $service_order->attendant()->exists() ? $service_order->attendant->name : '';

            foreach ($service_order->users as $user) {

                if ($user->pivot->role_in === 'pilot') {
                    $pilot = $user->name;
                } elseif ($user->pivot->role_in === 'client') {
                    $client = $user->name;
                }
            }

            return [
                'id' => $service_order->public_id,
                'name' => $service_order->name,
                'situation' => $situation,
                'pilot' => $pilot,
                'client' => $client,
                'attendant' => $attendant,
                'created_at' => $service_order->created_at->format('d/m/Y'),
                'updated_at' => $service_order->updated_at->format('d/m/Y'),
                'deleted_at' => $service_order->deleted_at,
            ];
        })->all();
    }
}
