<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clients\CreateClientRequest;
use App\Http\Requests\Clients\EditClientRequest;
use App\Http\Resources\Users\ClientResource;
use App\Models\User;
use App\Notifications\EmailVerificationAfterUpdateNotification;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClientController extends Controller
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
            ->where('role', 'cliente')
            ->filter($group) // scope
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'clients', (int) $page);

        return Inertia::render('Authenticated/Clients/Index', [
            'pagination' => ClientResource::collection($data),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('pilots-clients:write');

        return Inertia::render('Authenticated/Clients/CreateClient');
    }

    public function store(CreateClientRequest $request)
    {
        Gate::authorize('pilots-clients:write');

        $client = $this->model->create([
            ...$request->validated(),
            'role' => 'cliente',
            'tenant_id' => session('tenant_id'),
            'public_id' => Str::uuid(),
        ]);

        $client->address()->create();
        $client->document()->create();
        $client->contact()->create();

        $client->notify(new EmailVerificationNotification($request->password));

        return redirect()->route('clients.index', ['search' => $client->public_id->toString()])
            ->with('success', 'A criação do cliente foi bem sucedida');
    }

    public function show(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $client = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Clients/ShowClient', [
            'client' => new ClientResource($client)
        ]);
    }

    public function edit(string $id)
    {
        Gate::authorize('pilots-clients:write');

        $client = $this->model->withTrashed()->where('public_id', $id)->first();

        return Inertia::render('Authenticated/Clients/EditClient', [
            'client' => new ClientResource($client)
        ]);
    }

    public function update(EditClientRequest $request, string $id)
    {
        Gate::authorize('pilots-clients:write');

        $client = $this->model->withTrashed()->where('public_id', $id)->first();
        $client->update($request->validated());

        $email_changed = $client->email !== $request->input('email');

        $client->update($request->validated());

        if ($email_changed) {

            $client->update([
                'email_verified_at' => null,
            ]);

            $client->notify(new EmailVerificationAfterUpdateNotification);

        }

        return redirect()->route('clients.index', ['search' => $client->public_id])
            ->with('success', 'A edição do cliente foi bem sucedida');
    }

    public function destroy()
    {
        Gate::authorize('pilots-clients:write');

        $ids = explode(',', request('ids'));

        DB::transaction(function () use ($ids) {
            $this->model->whereIn('public_id', $ids)->delete();
        });

        return to_route('clients.index')
            ->with('success', 'Os clientes selecionados foram deletados');
    }
}
