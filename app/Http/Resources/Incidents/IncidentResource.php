<?php

namespace App\Http\Resources\Incidents;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class IncidentResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($report) {
            return [
                'id' => $report->public_id,
                'type' => $report->type,
                'description' => $report->description,
                'date' => date('d/m/Y', strtotime($report->date)),
                'created_at' => $report->created_at->format('d/m/Y'),
                'updated_at' => $report->updated_at->format('d/m/Y'),
            ];
        })->all();
    }
}
