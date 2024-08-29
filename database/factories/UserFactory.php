<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'public_id' => Str::uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'role' => 'gerente',
            'password' => Hash::make('12345'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified() {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }

    public function verified() {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => now(),
            ];
        });
    }

    public function deleted() {
        return $this->state(function (array $attributes) {
            return [
                'deleted_at' => now(),
            ];
        });
    }

    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
            ];
        });
    }

    public function manager()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'gerente',
            ];
        });
    }

    public function pilot()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'piloto',
            ];
        });
    }

    public function client()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'cliente',
            ];
        });
    }
}
