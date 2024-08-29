<?php

namespace App\Http\Resources\Batteries;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BatteryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'manufacturer' => $this->manufacturer,
            'model' => $this->model,
            'serial_number' => $this->serial_number,
            'last_charge' => date('d/m/Y', strtotime($this->last_charge)),
            'image_url' => $this->image_path ? Storage::disk('s3')->temporaryUrl($this->image, now()->addMinutes(5)) : 'none',
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
