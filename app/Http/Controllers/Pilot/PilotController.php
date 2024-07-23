<?php

namespace App\Http\Controllers\Pilot;

use App\Events\UserCreated;
use App\Events\UserEmailUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pilots\CreatePilotRequest;
use App\Http\Requests\Pilots\EditPilotRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PilotController extends Controller
{
    public function __construct(User $userModel)
    {
        $this->model = $userModel;
    }

    public function index()
    {
        Gate::authorize('pilots-clients:read');

        $order_by = request('order_by', 'id');
        $limit = request('limit', '10');
        $page = request('page', '1');
        $search = request('search', '');
        $group = request('group', 'all');

        $data = $this->model
            ->withTrashed()
            ->where('tenant_id', session('tenant_id'))
            ->where('role', 'piloto')
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'pilots', (int) $page);

        return Inertia::render('Authenticated/Pilots/Index', [
            'data' => new UserResource($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('pilots-clients:write');

        return Inertia::render('Authenticated/Pilots/CreatePilot');
    }

    public function store(CreatePilotRequest $request)
    {
        Gate::authorize('pilots-clients:write');

        $pilot = $this->model->create([
            ...$request->validated(),
            'role' => 'piloto',
            'tenant_id' => session('tenant_id'),
            'public_id' => Str::uuid(),
        ]);

        $pilot->address()->create();
        $pilot->document()->create();
        $pilot->contact()->create();

        event(new UserCreated($pilot, $request->password));

        return redirect()->route('pilots.index', ['search' => $pilot->public_id->toString()])
            ->with('success', 'A criação do piloto foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $pilot = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Pilots/ShowPilot', [
            'user' => [
                'id' => $pilot->public_id,
                'name' => $pilot->name,
                'role' => $pilot->role,
                'email' => $pilot->email,
                'status' => $pilot->trashed() ? 'Deletado' : ($pilot->status ? 'Ativo' : 'Inativo'),
                'created_at' => $pilot->created_at->format('d/m/Y'),
                'updated_at' => $pilot->updated_at->format('d/m/Y'),
                'deleted_at' => $pilot->deleted_at,
            ],
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $pilot = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Pilots/EditPilot', [
            'user' => [
                'id' => $pilot->public_id,
                'name' => $pilot->name,
                'email' => $pilot->email,
                'role' => $pilot->role,
            ],
        ]);
    }

    public function update(EditPilotRequest $request, string $id)
    {
        Gate::authorize('pilots-clients:write');

        $pilot = $this->model->withTrashed()->where('public_id', $id)->first();
        $pilot->update($request->validated());

        $email_changed = $pilot->email !== $request->input('email');

        $pilot->update($request->validated());

        if ($email_changed) {

            $pilot->update([
                'email_verified_at' => null,
            ]);

            event(new UserEmailUpdated($pilot));

        }

        return redirect()->route('pilots.index', ['search' => $pilot->public_id])
            ->with('success', 'A edição do piloto foi bem sucedida');
    }

    public function destroy()
    {
        Gate::authorize('pilots-clients:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $users = $this->model->where('public_id', $ids)->get();
            foreach ($users as $pilot) {
                $pilot->delete();
            }
        });

        return to_route('pilots.index')
            ->with('success', 'Os pilotos selecionados foram deletados');
    }
}
