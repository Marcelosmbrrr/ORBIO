<?php

namespace App\Http\Controllers\Pilot;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pilots\CreatePilotRequest;
use App\Http\Requests\Pilots\EditPilotRequest;
use App\Http\Resources\Users\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Notifications\EmailVerificationNotification;
use App\Notifications\EmailVerificationAfterUpdateNotification;

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

        $user = $this->model->create([
            ...$request->validated(),
            'role' => 'piloto',
            'tenant_id' => session('tenant_id'),
            'public_id' => Str::uuid(),
        ]);

        $user->address()->create();
        $user->document()->create();
        $user->contact()->create();

        $user->notify(new EmailVerificationNotification($request->password));

        return redirect()->route('pilots.index', ['search' => $user->public_id->toString()])
            ->with('success', 'A criação do piloto foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $user = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Pilots/ShowPilot', [
            'user' => [
                'id' => $user->public_id,
                'name' => $user->name,
                'role' => $user->role,
                'email' => $user->email,
                'status' => $user->trashed() ? 'Deletado' : ($user->status ? 'Ativo' : 'Inativo'),
                'created_at' => $user->created_at->format('d/m/Y'),
                'updated_at' => $user->updated_at->format('d/m/Y'),
                'deleted_at' => $user->deleted_at,
            ],
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $user = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Pilots/EditPilot', [
            'user' => [
                'id' => $user->public_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function update(EditPilotRequest $request, string $id)
    {
        Gate::authorize('pilots-clients:write');

        $user = $this->model->withTrashed()->where('public_id', $id)->first();
        $user->update($request->validated());

        $email_changed = $user->email !== $request->input('email');

        $user->update($request->validated());

        if ($email_changed) {

            $user->update([
                'email_verified_at' => null,
            ]);

            $user->notify(new EmailVerificationAfterUpdateNotification());

        }

        return redirect()->route('pilots.index', ['search' => $user->public_id])
            ->with('success', 'A edição do piloto foi bem sucedida');
    }

    public function destroy()
    {
        Gate::authorize('pilots-clients:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $users = $this->model->where('public_id', $ids)->get();
            foreach ($users as $user) {
                $user->delete();
            }
        });

        return to_route('pilots.index')
            ->with('success', 'Os pilotos selecionados foram deletados');
    }
}
