<?php

namespace App\Http\Resources\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;

class ReportResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($report) {
            return [
                'id' => $report->public_id,
                'name' => $report->name,
                'file' => Storage::url($report->file),
                'created_at' => $report->created_at->format('d/m/Y'),
                'updated_at' => $report->updated_at->format('d/m/Y'),
            ];
        })->all();
    }
}
