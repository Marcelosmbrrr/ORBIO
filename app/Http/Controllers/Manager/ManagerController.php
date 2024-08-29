<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\CreateManagerRequest;
use App\Http\Requests\Manager\EditManagerRequest;
use App\Http\Resources\Users\ManagerResource;
use App\Models\User;
use App\Notifications\EmailVerificationAfterUpdateNotification;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ManagerController extends Controller
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function index()
    {
        Gate::authorize('managers:read');

        $order_by = request('order_by', 'id');
        $limit = request('limit', '10');
        $page = request('page', '1');
        $search = request('search', '');
        $group = request('group', 'all');

        $data = $this->model
            ->withTrashed()
            ->where('role', 'gerente')
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, ['*'], 'managers', (int) $page);

        return Inertia::render('Authenticated/Managers/Index', [
            'pagination' => ManagerResource::collection($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('managers:write');

        return Inertia::render('Authenticated/Managers/CreateManager');
    }

    public function store(CreateManagerRequest $request)
    {
        Gate::authorize('managers:write');

        $manager = $this->model->create([
            ...$request->validated(),
            'role' => 'gerente',
            'public_id' => Str::uuid(),
        ]);

        $manager->address()->create();
        $manager->document()->create();
        $manager->contact()->create();

        $manager->notify(new EmailVerificationNotification($request->password));

        return redirect()->route('managers.index', ['search' => $manager->public_id])
            ->with('success', 'A criação do gerente foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('managers:read');

        $manager = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Managers/ShowManager', [
            'manager' => new ManagerResource($manager)
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('managers:write');

        $manager = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Managers/EditManager', [
            'manager' => new ManagerResource($manager)
        ]);
    }

    public function update(EditManagerRequest $request, string $id)
    {
        Gate::authorize('managers:write');

        $manager = $this->model->withTrashed()->where('public_id', $id)->first();

        $email_changed = $manager->email !== $request->input('email');

        $manager->update($request->validated());

        if ($email_changed) {

            $manager->update([
                'email_verified_at' => null,
            ]);

            $manager->notify(new EmailVerificationAfterUpdateNotification);

        }

        return redirect()->route('managers.index', ['search' => $manager->public_id])
            ->with('success', 'A edição do gerente foi bem sucedida');
    }

    public function destroy()
    {
        Gate::authorize('managers:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $this->model->whereIn('public_id', $ids)->delete();
        });

        return redirect()->route('managers.index', ['group' => 'deleted'])
            ->with('success', 'Os gerentes selecionados foram deletados');
    }
}
