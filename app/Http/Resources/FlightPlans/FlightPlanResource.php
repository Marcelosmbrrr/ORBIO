<?php

namespace App\Http\Resources\FlightPlans;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FlightPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $single_file_path = Storage::disk('s3')->files($this->file.'/single');
        $single_file_content = Storage::disk('s3')->get($single_file_path[0]);

        $multi_file_paths = Storage::disk('s3')->files($this->file.'/multi');
        $multi_file_contents = [];

        foreach ($multi_file_paths as $index => $file_path) {
            $file_content = Storage::disk('s3')->get($file_path);
            $filename = explode('.', explode('/', $file_path)[4])[0];
            $multi_file_contents[$index] = $file_content;
        }

        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'state' => $this->state,
            'city' => $this->city,
            'file' => [
                'single' => $single_file_content,
                'multi' => $multi_file_contents,
            ],
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
