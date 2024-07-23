<?php

namespace App\Http\Resources\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreateReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'location' => [
                'state' => $this->flight_plans[0]->state,
                'city' => $this->flight_plans[0]->city,
            ],
            'pilot' => $this->pilot()->exists() ? $this->pilot[0]->name : $this->attendant->name,
            'client' => $this->client()->exists() ? $this->client[0]->name : '',
            'drones' => $this->drones ?? [],
            'batteries' => $this->batteries ?? [],
            'equipments' => $this->equipments ?? [],
            'flightplans' => $this->flight_plans,
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
        ];
    }
}
