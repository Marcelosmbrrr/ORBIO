<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $manager = User::create([
            'public_id' => Str::uuid(),
            'name' => 'Gerente',
            'role' => 'gerente',
            'email' => 'gerente1@gmail.com',
            'password' => '12345',
            'email_verified_at' => now(),
        ]);

        $manager->address()->create();
        $manager->document()->create();
        $manager->contact()->create();
    }
}
