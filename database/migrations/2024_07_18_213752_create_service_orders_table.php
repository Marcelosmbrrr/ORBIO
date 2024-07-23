<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained('users');
            $table->foreignId('attendant_id')->nullable()->constrained('users');
            $table->string('name')->unique();
            $table->enum('situation', ['open', 'approved', 'finished', 'canceled'])->default('open');
            $table->boolean('status')->default(true);
            $table->text('observation')->nullable();
            $table->timestamps();
        });

        Schema::create('service_order_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained('service_orders')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('role_in', ['pilot', 'client']);
        });

        Schema::create('service_order_flight_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained('service_orders')->onDelete('cascade');
            $table->foreignId('flight_plan_id')->constrained('flight_plans')->onDelete('cascade');
        });

        Schema::create('service_order_drone', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained('service_orders')->onDelete('cascade');
            $table->foreignId('drone_id')->nullable(true)->constrained('drones');
        });

        Schema::create('service_order_battery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained('service_orders')->onDelete('cascade');
            $table->foreignId('battery_id')->nullable(true)->constrained('batteries');
        });

        Schema::create('service_order_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained('service_orders')->onDelete('cascade');
            $table->foreignId('equipment_id')->nullable(true)->constrained('equipments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_orders');
        Schema::dropIfExists('service_order_user');
        Schema::dropIfExists('service_order_flight_plan');
        Schema::dropIfExists('service_order_drone');
        Schema::dropIfExists('service_order_battery');
        Schema::dropIfExists('service_order_equipment');
    }
};
