<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RevertDeletionController extends Controller
{
    public function __invoke(string $table)
    {
        $ids = explode(",", request("ids"));

        DB::table($table)->whereIn('public_id', $ids)->update([
            'deleted_at' => null
        ]);

        return redirect()->back()->with('success', 'Recurso(s) Recuperado(s)!');
    }
}