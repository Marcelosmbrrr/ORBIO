<?php

namespace App\Http\Resources\Batteries;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;

class BatteryResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($battery) {
            return [
                'id' => $battery->public_id,
                'name' => $battery->name,
                'manufacturer' => $battery->manufacturer,
                'model' => $battery->model,
                'serial_number' => $battery->serial_number,
                'last_charge' => date('d/m/Y', strtotime($battery->last_charge)),
                'image_url' => $battery->image_path ? Storage::disk('s3')->temporaryUrl($battery->image, now()->addMinutes(5)) : 'none',
                'status' => [
                    'title' => $battery->trashed() ? 'Deletado' : 'Ativo',
                    'style_key' => $battery->trashed() ? 'deleted' : 'active',
                ],
                'created_at' => $battery->created_at->format('d/m/Y'),
                'updated_at' => $battery->updated_at->format('d/m/Y'),
                'deleted_at' => $battery->deleted_at,
            ];
        })->all();
    }
}
