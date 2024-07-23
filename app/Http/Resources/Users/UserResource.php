<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserResource extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($user) {
            return [
                'id' => $user->public_id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => [
                    'value' => (bool) $user->email_verified_at,
                    'title' => $user->trashed() ? 'Deletado' : ((bool) $user->email_verified_at ? 'Verificado' : 'Não Verificado'),
                    'style_key' => $user->trashed() ? 'deleted' : ((bool) $user->email_verified_at ? 'verified' : 'unverified'),
                ],
                'created_at' => $user->created_at->format('d/m/Y'),
                'updated_at' => $user->updated_at->format('d/m/Y'),
                'deleted_at' => $user->deleted_at,
            ];
        })->all();
    }
}
