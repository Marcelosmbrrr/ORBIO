<?php

namespace App\Http\Controllers\Batteries;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Requests\Batteries\CreateBatteryRequest;
use App\Http\Requests\Batteries\EditBatteryRequest;
use App\Http\Resources\Batteries\BatteryResource;
use App\Models\Battery;
use Illuminate\Support\Facades\DB;

class BatteryController extends Controller
{
    public function __construct(Battery $batteryModel)
    {
        $this->model = $batteryModel;
    }

    public function index()
    {
        Gate::authorize('equipments:read');

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
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'batteries', (int) $page);

        return Inertia::render('Authenticated/Batteries/Index', [
            'pagination' => BatteryResource::collection($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('equipments:write');

        return Inertia::render('Authenticated/Batteries/CreateBattery');
    }

    public function store(CreateBatteryRequest $request)
    {
        Gate::authorize('equipments:write');

        $battery = $this->model->create([
            ...$request->validated(),
            'tenant_id' => session('tenant_id'),
            'public_id' => Str::uuid(),
        ]);

        $image_path = session('tenant_id').'/batteries/'.$battery->public_id.'.jpeg';

        if ($request->hasFile('image') && ! Storage::disk('s3')->exists($image_path)) {
            Storage::disk('s3')->putFileAs('', $request->file('image'), $image_path);
            $battery->update([
                'image' => $image_path,
            ]);
        }

        return redirect()->route('batteries.index', ['search' => $battery->public_id->toString()])
            ->with('success', 'A criação da bateria foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('equipments:write');

        $battery = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Batteries/ShowBattery', [
            'battery' => new BatteryResource($battery)
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('equipments:write');

        $battery = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Batteries/EditBattery', [
            'battery' => new BatteryResource($battery)
        ]);
    }

    public function update(EditBatteryRequest $request, string $id)
    {
        Gate::authorize('equipments:write');

        $battery = $this->model->withTrashed()->where('public_id', $id)->first();
        $battery->update($request->validated());

        if ($request->hasFile('image')) {
            Storage::disk('s3')->putFileAs('', $request->file('image'), $battery->image);
        }

        return redirect()->route('batteries.index', ['search' => $battery->public_id])
            ->with('success', 'A edição da bateria foi bem sucedida');
    }

    public function destroy()
    {
        Gate::authorize('equipments:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $this->model->whereIn('public_id', $ids)->delete();
        });

        return to_route('batteries.index')
            ->with('success', 'As baterias selecionadas foram deletadas');
    }
}
