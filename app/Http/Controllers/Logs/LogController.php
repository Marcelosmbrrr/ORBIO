<?php

namespace App\Http\Controllers\Logs;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\ServiceOrder;
use App\Models\Log;
use App\Http\Requests\Logs\CreateLogRequest;

class LogController extends Controller
{
    function __construct(Log $logModel, ServiceOrder $serviceOrderModel)
    {
        $this->logModel = $logModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    public function create(string $service_order_id)
    {
        Gate::authorize('service-orders:edit');

        return Inertia::render("Authenticated/Logs/CreateLog", [
            "service_order_id" => $service_order_id
        ]);
    }

    public function store(CreateLogRequest $request, string $service_order_id)
    {
        Gate::authorize('service-orders:edit');

        $service_order = $this->serviceOrderModel->where("public_id", $service_order_id)->first();

        DB::transaction(function () use ($request, $service_order) {

            foreach ($request->logs as $log) {

                $public_id = Str::uuid();
                $file_path = session('tenant_id') . "/logs/" . $public_id . ".kml";

                $service_order->logs()->create([
                    "public_id" => $public_id,
                    "service_order_id" => $service_order->id,
                    "name" => pathinfo($log->getClientOriginalName(), PATHINFO_FILENAME),
                    "file" => $file_path
                ]);

                Storage::disk('public')->putFileAs('', $log, $file_path);
            }
        });

        return redirect()->route('service-orders.show', ['service_order' => $service_order->public_id])
            ->with('success', "A criação dos logs foi bem sucedida");
    }

    public function show(string $service_order_id, string $log_id)
    {
        $log = $this->logModel->where("public_id", $log_id)->first();

        $log = Storage::disk("public")->get($log->file);

        return view("map-visualization", [
            "log" => $log
        ]);
    }

    public function destroy(string $service_order_id)
    {
        Gate::authorize('service-orders:edit');

        $ids = explode(",", request("ids"));

        DB::transaction(function () use ($ids) {

            $log = $this->logModel->where("public_id", $ids)->first();
            $log->delete();

            Storage::disk('public')->delete($log->file);
        });

        return redirect()->route('service-orders.show', ['service_order' => $service_order_id])
            ->with('success', "Os logs selecionados foram permanentemente deletados");
    }
}
