<?php

namespace App\Http\Controllers\FlightPlans;

use App\Http\Controllers\Controller;
use App\Http\Requests\FlightPlans\CreateFlightPlanRequest;
use App\Http\Requests\FlightPlans\EditFlightPlanRequest;
use App\Http\Resources\FlightPlans\FlightPlanResource;
use App\Models\FlightPlan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FlightPlanController extends Controller
{
    public function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function index()
    {
        Gate::authorize('flight-plans:read');

        $order_by = request('order_by', 'id');
        $limit = request('limit', '10');
        $page = request('page', '1');
        $search = request('search', '');
        $group = request('group', 'all');

        $data = $this->model
            ->withTrashed()
            ->where('tenant_id', session('tenant_id'))
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'flight-plans', (int) $page);

        return Inertia::render('Authenticated/FlightPlans/Index', [
            'data' => new FlightPlanResource($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('flight-plans:write');

        return view('map');
    }

    public function store(CreateFlightPlanRequest $request)
    {
        Gate::authorize('flight-plans:write');

        $flight_plan = DB::transaction(function () use ($request) {

            $public_id = Str::uuid();
            $file_path = session('tenant_id').'/flight-plans/'.$public_id;

            $address = Http::get('https://maps.googleapis.com/maps/api/geocode/json?latlng='.$request->coordinates[0].'&key='.env('GEOCODING_API_KEY'))['results'][0]['address_components'];
            $city = $address[2]['long_name'];
            $state = strlen($address[3]['short_name']) === 2 ? $address[3]['short_name'] : $address[4]['short_name'];

            $flight_plan = $this->model->create([
                'name' => $request->name,
                'tenant_id' => session('tenant_id'),
                'public_id' => $public_id,
                'city' => $city,
                'state' => $state,
                'file' => $file_path,
            ]);

            // Store single_file
            $singleFilePath = $file_path.'/single/'.time().'.txt';
            Storage::disk('public')->put($singleFilePath, file_get_contents($request->file('single_file')->getRealPath()));

            // Store multi file
            foreach ($request->file('multi_file') as $index => $file) {
                $multiFilePath = $file_path.'/multi/'.($index).'_'.time().'.txt';
                Storage::disk('public')->put($multiFilePath, file_get_contents($file->getRealPath()));
            }

            return $flight_plan;
        });

        return to_route('flight-plans.index')
            ->with('success', 'A criação do plano de voo foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('flight-plans:read');

        $flight_plan = $this->model->withTrashed()->where('public_id', $id)->first();

        $folder = Storage::disk('public')->files($flight_plan->file.'/single');
        $file = Storage::disk('public')->get($folder[0]);

        if (request()->visualization) {
            return view('map-visualization', [
                'flightplan' => $file,
            ]);
        }

        return Inertia::render('Authenticated/FlightPlans/ShowFlightPlan', [
            'flightplan' => [
                'id' => $flight_plan->public_id,
                'name' => $flight_plan->name,
                'coordinates' => $flight_plan->coordinates,
                'state' => $flight_plan->state,
                'city' => $flight_plan->city,
                'status' => [
                    'title' => $flight_plan->trashed() ? 'Deletado' : 'Ativo',
                    'style_key' => $flight_plan->trashed() ? 'deleted' : 'active',
                ],
                'created_at' => $flight_plan->created_at->format('d/m/Y'),
                'updated_at' => $flight_plan->updated_at->format('d/m/Y'),
                'deleted_at' => $flight_plan->deleted_at,
            ],
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('flight-plans:write');

        $flight_plan = $this->model->withTrashed()->where('public_id', $id)->first();

        $folder = Storage::disk('public')->files($flight_plan->file.'/single');
        $file = Storage::disk('public')->get($folder[0]);

        return view('map', [
            'flightplan' => $file,
        ]);
    }

    public function update(EditFlightPlanRequest $request, string $id)
    {
        Gate::authorize('flight-plans:write');

        $flight_plan = DB::transaction(function () use ($request, $id) {

            $flight_plan = $this->model->withTrashed()->where('public_id', $id)->first();

            $address = Http::get('https://maps.googleapis.com/maps/api/geocode/json?latlng='.$request->coordinates[0].'&key='.env('GEOCODING_API_KEY'))['results'][0]['address_components'];
            $city = $address[2]['long_name'];
            $state = strlen($address[3]['short_name']) === 2 ? $address[3]['short_name'] : $address[4]['short_name'];

            $flight_plan->update([
                'name' => $request->name,
                'city' => $city,
                'state' => $state,
                'coordinates' => $request->coordinates[0],
            ]);

            // Store single_file
            $single_file_path = $flight_plan->file.'/single/'.now().'.txt';
            Storage::disk('public')->putFileAs('', $single_file_path, $request->single_file);

            // Store multi file
            foreach ($request->multi_file as $index => $file) {
                $multi_file_path = $flight_plan->file.'/multi/'.$index + 1 .'_'.now().'.txt';
                Storage::disk('public')->put($multi_file_path, $file);
            }

            return $flight_plan;
        });

        return response([
            'message' => 'A edição do plano de voo foi bem sucedida',
        ], 200);
    }

    public function destroy()
    {
        Gate::authorize('flight-plans:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $flightplans = $this->model->where('public_id', $ids)->get();
            foreach ($flightplans as $flightplan) {
                $flightplan->delete();
            }
        });

        return to_route('flight-plans.index')
            ->with('success', 'Os planos de voo selecionados foram deletados');
    }
}
