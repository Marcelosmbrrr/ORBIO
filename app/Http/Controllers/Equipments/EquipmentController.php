<?php

namespace App\Http\Controllers\Equipments;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Equipment;
use App\Http\Requests\Equipments\CreateEquipmentRequest;
use App\Http\Requests\Equipments\EditEquipmentRequest;
use App\Http\Resources\Equipments\EquipmentResource;

class EquipmentController extends Controller
{
    function __construct(Equipment $equipmentModel)
    {
        $this->model = $equipmentModel;
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
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'equipments', (int) $page);

        return Inertia::render("Authenticated/Equipments/Index", [
            "data" => new EquipmentResource($data),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('equipments:write');

        return Inertia::render("Authenticated/Equipments/CreateEquipment");
    }

    public function store(CreateEquipmentRequest $request)
    {
        Gate::authorize('equipments:write');

        $equipment = $this->model->create([
            ...$request->validated(),
            "tenant_id" => session("tenant_id"),
            'public_id' => Str::uuid(),
        ]);

        $image_path = session('tenant_id') . "/equipments/" . $equipment->public_id . ".jpeg";

        if ($request->hasFile('image') && !Storage::disk('public')->exists($image_path)) {
            Storage::disk('public')->putFileAs('', $request->file('image'), $image_path);
            $equipment->update([
                "image" => $image_path
            ]);
        }

        return redirect()->route('equipments.index', ['search' => $equipment->public_id->toString()])
            ->with('success', 'A criação do equipamento foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('equipments:write');

        $equipment = $this->model->withTrashed()->where("public_id", $id)->first();

        return Inertia::render("Authenticated/Equipments/ShowEquipment", [
            "equipment" => [
                "id" => $equipment->public_id,
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "image" => $equipment->image ? Storage::url($equipment->image) : "",
                "created_at" => $equipment->created_at->format('d/m/Y'),
                "updated_at" => $equipment->updated_at->format('d/m/Y'),
                "deleted_at" => $equipment->deleted_at

            ]
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('equipments:write');

        $equipment = $this->model->withTrashed()->where("public_id", $id)->first();

        return Inertia::render("Authenticated/Equipments/EditEquipment", [
            "equipment" => [
                "id" => $equipment->public_id,
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "image" => $equipment->image ? Storage::url($equipment->image) : "",
            ]
        ]);
    }

    public function update(EditEquipmentRequest $request, string $id)
    {
        Gate::authorize('equipments:write');

        $equipment = $this->model->withTrashed()->where("public_id", $id)->first();
        $equipment->update($request->validated());

        if ($request->hasFile('image')) {
            Storage::disk('public')->putFileAs('', $request->file('image'), $equipment->image);
        }

        return redirect()->route('equipments.index', ['search' => $equipment->public_id])
            ->with('success', "A edição do equipamento foi bem sucedida");
    }

    public function destroy()
    {
        Gate::authorize('equipments:write');

        $ids = explode(",", request("ids"));

        DB::transaction(function () use ($ids) {
            $equipments = $this->model->whereIn("public_id", $ids)->get();
            foreach ($equipments as $equipment) {
                $equipment->delete();
            }
        });

        return to_route('equipments.index')
            ->with('success', "Os equipmentos selecionados foram deletados");
    }
}
