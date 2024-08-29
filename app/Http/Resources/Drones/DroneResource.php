<?php

namespace App\Http\Resources\Drones;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DroneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'manufacturer' => $this->manufacturer,
            'model' => $this->model,
            'record_number' => $this->record_number,
            'serial_number' => $this->serial_number,
            'weight' => $this->weight,
            'image' => $this->image ? Storage::disk('s3')->temporaryUrl($this->image, now()->addMinutes(5)) : '',
            'status' => [
                'title' => $this->trashed() ? 'Deletado' : 'Ativo',
                'style_key' => $this->trashed() ? 'deleted' : 'active',
            ],
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'deleted_at' => $this->deleted_at,
        ];
    }
}
