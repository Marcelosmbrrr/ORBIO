<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            "public_id" => Str::uuid(),
            "name" => "Admin",
            "role" => "admin",
            "email" => env("ADMIN_EMAIL"), 
            "password" => env("ADMIN_PASSWORD"), 
            "email_verified_at" => now()
        ]);

        $admin->address()->create();
        $admin->document()->create();
        $admin->contact()->create();
    }
}
