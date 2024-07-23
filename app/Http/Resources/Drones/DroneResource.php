<?php

namespace App\Http\Resources\Drones;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;

class DroneResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($drone) {
            return [
                'id' => $drone->public_id,
                'name' => $drone->name,
                'manufacturer' => $drone->manufacturer,
                'model' => $drone->model,
                'record_number' => $drone->record_number,
                'serial_number' => $drone->serial_number,
                'weight' => $drone->weight,
                'image' => $drone->image ? Storage::url($drone->image) : '',
                'status' => [
                    'title' => $drone->trashed() ? 'Deletado' : 'Ativo',
                    'style_key' => $drone->trashed() ? 'deleted' : 'active',
                ],
                'created_at' => $drone->created_at->format('d/m/Y'),
                'updated_at' => $drone->updated_at->format('d/m/Y'),
                'deleted_at' => $drone->deleted_at,
            ];
        })->all();
    }
}
