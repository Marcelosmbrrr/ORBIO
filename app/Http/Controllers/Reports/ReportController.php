<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use App\Models\ServiceOrder;
use App\Models\Log;
use App\Http\Requests\Reports\CreateReportRequest;
use App\Http\Resources\Logs\LogResource;
use App\Http\Resources\Reports\CreateReportResource;

class ReportController extends Controller
{
    function __construct(Report $reportModel, ServiceOrder $serviceOrderModel, Log $logModel)
    {
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
        $this->logModel = $logModel;
    }

    public function create(string $service_order_id)
    {
        Gate::authorize('service-orders:edit');

        $order_by = request("order_by", "id");
        $limit = request("limit", "10");
        $page = request("page", "1");
        $search = request("search", "");

        $service_order = $this->serviceOrderModel->with(['pilot', 'client', 'drones', 'batteries', 'equipments', 'flight_plans', 'incidents'])->where("public_id", $service_order_id)->first();

        return Inertia::render("Authenticated/ServiceOrders/Reports/CreateReport", [
            "serviceorder" => new CreateReportResource($service_order),
            "logs" => fn () => new LogResource(
                $this->logModel
                    ->where("service_order_id", $service_order->id)
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'report-logs', (int) $page)
            ),
        ]);
    }

    public function store(CreateReportRequest $request)
    {
        Gate::authorize('service-orders:edit');

        DB::transaction(function () use ($request) {

            $service_order = $this->serviceOrderModel->find(request()->service_order_id);

            if (!$request->file("file")) {
                throw new \Exception("Erro! O arquivo não foi enviado.");
            }

            $file_content = file_get_contents($request->file("file"));
            $filename = time() . ".pdf";
            $file_path = session("tenant_id") . "/reports/$filename";

            $report = $this->reportModel->create([
                "service_order_id" => $service_order->id,
                "name" => $request->name,
                "file_path" => $file_path,
            ]);

            Storage::disk('public')->put($file_path, $file_content);
        });

        return to_route('service-orders.show')
            ->with('success', "Relatório criado!");
    }

    public function destroy(string $service_order_id, string $report_id)
    {
        Gate::authorize('service-orders:edit');

        $report = $this->reportModel->find($report_id);

        if (!$report->service_order->status) {
            throw new \Exception("O relatório não pode ser deletado.", 409);
        }

        $report->delete();

        Storage::disk('public')->delete($report->file_path);

        return to_route('service-orders.show')
            ->with('success', "Os relatórios selecionados foram permanentemente deletados");
    }
}
