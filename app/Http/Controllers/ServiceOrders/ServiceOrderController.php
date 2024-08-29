<?php

namespace App\Http\Controllers\ServiceOrders;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceOrders\CreateServiceOrderRequest;
use App\Http\Requests\ServiceOrders\EditServiceOrderRequest;
use App\Http\Resources\Batteries\BatteryResource;
use App\Http\Resources\Drones\DroneResource;
use App\Http\Resources\Equipments\EquipmentResource;
use App\Http\Resources\FlightPlans\FlightPlanResource;
use App\Http\Resources\Incidents\IncidentResource;
use App\Http\Resources\Logs\LogResource;
use App\Http\Resources\Reports\ReportResource;
use App\Http\Resources\ServiceOrders\ServiceOrderResource;
use App\Http\Resources\ServiceOrders\ServiceOrderViewResource;
use App\Http\Resources\Users\PilotResource;
use App\Http\Resources\Users\ClientResource;
use App\Models\Battery;
use App\Models\Drone;
use App\Models\Equipment;
use App\Models\FlightPlan;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceOrderController extends Controller
{
    public function __construct(ServiceOrder $model)
    {
        $this->model = $model;
    }

    public function index()
    {
        Gate::authorize('service-orders:read');

        $order_by = request('order_by', 'id');
        $limit = request('limit', '10');
        $page = request('page', '1');
        $search = request('search', '');
        $group = request('group', 'all');

        $data = $this->model
            ->where('tenant_id', session('tenant_id'))
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'service-orders', (int) $page);

        return Inertia::render('Authenticated/ServiceOrders/Index', [
            'pagination' => ServiceOrderResource::collection($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('service-orders:create');

        $order_by = request('order_by', 'id');
        $limit = request('limit', '10');
        $page = request('page', '1');
        $search = request('search', '');
        $group = request('group', 'all');

        // Inertia partial reload
        // https://inertiajs.com/partial-reloads

        return Inertia::render('Authenticated/ServiceOrders/CreateServiceOrder', [
            'pilots' => fn () => PilotResource::collection(
                User::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->where('role', 'piloto')
                    ->filter($group) // scope
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'pilots', (int) $page)
            ),
            'clients' => Inertia::lazy(fn () => ClientResource::collection(
                User::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->where('role', 'cliente')
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'clients', (int) $page)
            )),
            'flightplans' => Inertia::lazy(fn () => FlightPlanResource::collection(
                FlightPlan::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'flight-plans', (int) $page)
            )),
            'drones' => Inertia::lazy(fn () => DroneResource::collection(
                Drone::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'drones', (int) $page)
            )),
            'batteries' => Inertia::lazy(fn () => BatteryResource::collection(
                Battery::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'batteries', (int) $page)
            )),
            'equipments' => Inertia::lazy(fn () => EquipmentResource::collection(
                Equipment::filter('active')
                    ->where('tenant_id', session('tenant_id'))
                    ->search($search)
                    ->orderBy($order_by)
                    ->paginate((int) $limit, $columns = ['*'], $pageName = 'equipments', (int) $page)
            )),
        ]);
    }

    public function store(CreateServiceOrderRequest $request)
    {
        Gate::authorize('service-orders:create');

        $service_order = DB::transaction(function () use ($request) {

            $service_order = $this->model->create([
                'public_id' => Str::uuid(),
                'tenant_id' => session('tenant_id'),
                'name' => 'Os.'.time(),
            ]);

            if ((bool) count($request->pilot)) {
                $pilot = User::where('public_id', $request->pilot[0]['id'])->first();
                $service_order->users()->attach($pilot->id, ['role_in' => 'pilot']);
            }

            if ((bool) count($request->client)) {
                $client = User::where('public_id', $request->client[0]['id'])->first();
                $service_order->users()->attach($client->id, ['role_in' => 'client']);
            }

            if ((bool) count($request->flightplans)) {
                $public_ids = array_column($request->flightplans, 'id');
                $flight_plans_ids = FlightPlan::whereIn('public_id', $public_ids)->get('id');
                $service_order->flight_plans()->attach($flight_plans_ids);
            }

            if ((bool) count($request->drones)) {
                $public_ids = array_column($request->drones, 'id');
                $drones_ids = Drone::whereIn('public_id', $public_ids)->get('id');
                $service_order->drones()->attach($drones_ids);
            }

            if ((bool) count($request->batteries)) {
                $public_ids = array_column($request->batteries, 'id');
                $batteries_ids = Battery::whereIn('public_id', $public_ids)->get('id');
                $service_order->batteries()->attach($batteries_ids);
            }

            if ((bool) count($request->equipments)) {
                $public_ids = array_column($request->equipments, 'id');
                $equipments_ids = Equipment::whereIn('public_id', $public_ids)->get('id');
                $service_order->equipments()->attach($equipments_ids);
            }

            return $service_order;
        });

        return to_route('service-orders.index', ['search' => $service_order->public_id])
            ->with('success', 'A criação da ordem de serviço foi bem sucedida');
    }

    public function update(EditServiceOrderRequest $request, string $id)
    {
        Gate::authorize('service-orders:edit');

        $service_order = $this->model->where('public_id', $id)->first();

        if ($request->situation) {

            $data['situation'] = $request->situation;
            $message = '';
            if ($request->situation === 'approved') {
                $data['attendant_id'] = Auth::user()->id;
                $message = 'A ordem de serviço foi aprovada';
            } elseif ($request->situation === 'canceled') {
                $data['observation'] = $request->observation;
                $message = 'A ordem de serviço foi cancelada';
            } elseif ($request->situation === 'finished') {
                $message = 'A ordem de serviço foi finalizada';
            }

            $service_order->update($data);

            return redirect()->route('service-orders.show', ['service_order' => $service_order->public_id])
                ->with('success', $message);
        } elseif ((bool) $request->report) {

            $public_id = Str::uiid();
            $file_path = session('tenant_id').'/reports/'.$public_id.'/'.$public_id.'.pdf';

            $service_order->reports->create([
                'public_id' => $public_id,
                'name' => '',
                'file' => $file_path,
            ]);

            Storage::disk('s3')->putFileAs('', $file_path, $request->report);

            return redirect()->route('service-orders.show', ['service_order' => $service_order->public_id])
                ->with('success', 'A edição da ordem de serviço foi bem sucedida');
        }
    }

    public function show(string $id)
    {
        Gate::authorize('service-orders:read');

        $service_order = $this->model->where('public_id', $id)->first();

        return Inertia::render('Authenticated/ServiceOrders/ShowServiceOrder', [
            'success' => session('success'),
            'service_order_id' => $id,
            'can' => [
                'edit' => Auth::user()->role === 'piloto',
                'edit_log' => $service_order->attendant && $service_order->situation === 'approved' ? $service_order->attendant->id === Auth::user()->id : false,
                'edit_report' => $service_order->attendant && $service_order->situation === 'approved' ? $service_order->attendant->id === Auth::user()->id : false,
            ],
            'serviceorder' => new ServiceOrderViewResource($service_order),
            'flightplans' => fn () => FlightPlanResource::collection($service_order->flight_plans),
            'drones' => fn () => DroneResource::collection($service_order->drones),
            'batteries' => fn () => BatteryResource::collection($service_order->batteries),
            'equipments' => fn () => EquipmentResource::collection($service_order->equipments),
            'incidents' => fn () => IncidentResource::collection($service_order->incidents),
            'logs' => fn () => LogResource::collection($service_order->logs),
            'reports' => fn () => ReportResource::collection($service_order->reports),
        ]);
    }
}
