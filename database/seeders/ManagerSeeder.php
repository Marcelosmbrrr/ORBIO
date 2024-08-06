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
        $managers = [
            [
                'public_id' => Str::uuid(),
                'name' => 'Bruno Siqueira',
                'role' => 'gerente',
                'email' => 'bruno.siqueira@iffarroupilha.edu.br',
                'password' => '12345',
                'email_verified_at' => now(),
            ],
            [
                'public_id' => Str::uuid(),
                'name' => 'Nicholas Matias',
                'role' => 'gerente',
                'email' => 'nickmatias@gmail.com',
                'password' => '12345',
                'email_verified_at' => now(),
            ],
            [
                'public_id' => Str::uuid(),
                'name' => 'Marcelo Moreira',
                'role' => 'gerente',
                'email' => 'marcelosmbr2015@gmail.com',
                'password' => '12345',
                'email_verified_at' => now(),
            ]
        ];

        foreach ($managers as $manager_data) {
            $manager = User::create($manager_data);
            $manager->address()->create();
            $manager->document()->create();
            $manager->contact()->create();
        }
    }

}
