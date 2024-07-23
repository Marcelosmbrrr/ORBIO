<?php

namespace App\Http\Resources\FlightPlans;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;

class FlightPlanResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($flightplan) {

            $single_file_path = Storage::disk('public')->files($flightplan->file.'/single');
            $single_file_content = Storage::disk('public')->get($single_file_path[0]);

            $multi_file_paths = Storage::disk('public')->files($flightplan->file.'/multi');
            $multi_file_contents = [];

            foreach ($multi_file_paths as $index => $file_path) {
                $file_content = Storage::disk('public')->get($file_path);
                $filename = explode('.', explode('/', $file_path)[4])[0];
                $multi_file_contents[$index] = $file_content;
            }

            return [
                'id' => $flightplan->public_id,
                'name' => $flightplan->name,
                'state' => $flightplan->state,
                'city' => $flightplan->city,
                'file' => [
                    'single' => $single_file_content,
                    'multi' => $multi_file_contents,
                ],
                'status' => [
                    'title' => $flightplan->trashed() ? 'Deletado' : 'Ativo',
                    'style_key' => $flightplan->trashed() ? 'deleted' : 'active',
                ],
                'created_at' => $flightplan->created_at->format('d/m/Y'),
                'updated_at' => $flightplan->updated_at->format('d/m/Y'),
                'deleted_at' => $flightplan->deleted_at,
            ];
        })->all();
    }
}
