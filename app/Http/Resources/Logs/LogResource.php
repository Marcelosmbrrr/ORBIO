<?php

namespace App\Http\Resources\Logs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;

class LogResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($log) {

            return [
                'id' => $log->public_id,
                'name' => $log->name,
                'file' => Storage::disk('public')->get($log->file),
                'created_at' => $log->created_at->format('d/m/Y'),
                'updated_at' => $log->updated_at->format('d/m/Y'),
            ];

        })->all();
    }
}
