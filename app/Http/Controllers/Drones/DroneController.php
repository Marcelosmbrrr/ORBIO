<?php

namespace App\Http\Controllers\Drones;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Drone;
use App\Http\Requests\Drones\CreateDroneRequest;
use App\Http\Requests\Drones\EditDroneRequest;
use App\Http\Resources\Drones\DroneResource;

class DroneController extends Controller
{
    function __construct(Drone $droneModel)
    {
        $this->model = $droneModel;
    }

    public function index()
    {
        Gate::authorize('equipments:read');

        $order_by = request("order_by", "id");
        $limit = request("limit", "10");
        $page = request("page", "1");
        $search = request("search", "");
        $group = request("group", "all");

        $data = $this->model
            ->withTrashed()
            ->where('tenant_id', session('tenant_id'))
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'drones', (int) $page);

        return Inertia::render("Authenticated/Equipments/Drones/Index", [
            "data" => new DroneResource($data),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('equipments:write');

        return Inertia::render("Authenticated/Equipments/Drones/CreateDrone");
    }

    public function store(CreateDroneRequest $request)
    {
        Gate::authorize('equipments:write');

        $drone = $this->model->create([
            ...$request->validated(),
            "tenant_id" => session("tenant_id"),
            'public_id' => Str::uuid()
        ]);

        $image_path = session('tenant_id') . "/drones/" . $drone->public_id . ".jpeg";

        if ($request->hasFile('image') && !Storage::disk('public')->exists($image_path)) {
            Storage::disk('public')->putFileAs('', $request->file('image'), $image_path);
            $drone->update([
                "image" => $image_path
            ]);
        }

        return redirect()->route('drones.index', ['search' => $drone->public_id->toString()])
            ->with('success', 'Drone criado!');
    }

    public function show(string $id)
    {
        Gate::authorize('equipments:write');

        $drone = $this->model->withTrashed()->where("public_id", $id)->first();

        return Inertia::render("Authenticated/Equipments/Drones/ShowDrone", [
            "drone" => [
                "id" => $drone->public_id,
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "image" => $drone->image ? Storage::url($drone->image) : "",
                "created_at" => $drone->created_at->format('d/m/Y'),
                "updated_at" => $drone->updated_at->format('d/m/Y'),
                "deleted_at" => $drone->deleted_at
            ]
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('equipments:write');

        $drone = $this->model->withTrashed()->where("public_id", $id)->first();

        return Inertia::render("Authenticated/Equipments/Drones/EditDrone", [
            "drone" => [
                "id" => $drone->public_id,
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "image" => $drone->image ? Storage::url($drone->image) : ""
            ]
        ]);
    }

    public function update(EditDroneRequest $request, string $id)
    {
        Gate::authorize('equipments:write');

        $drone = $this->model->withTrashed()->where("public_id", $id)->first();
        $drone->update($request->validated());

        if ($request->hasFile('image')) {
            Storage::disk('public')->putFileAs('', $request->file('image'), $drone->image);
        }

        return redirect()->route('drones.index', ['search' => $drone->public_id])
            ->with('success', "Drone editado!");
    }

    public function destroy()
    {
        Gate::authorize('equipments:write');

        $ids = explode(",", request("ids"));

        DB::transaction(function () use ($ids) {
            $drones = $this->model->whereIn("public_id", $ids)->get();
            foreach ($drones as $drone) {
                $drone->delete();
            }
        });

        return redirect()->route('drones.index')
            ->with('success', "Drone(s) Excluído(s)!");
    }
}
