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
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained('users');
            $table->string('name');
            $table->string('manufacturer');
            $table->string('model');
            $table->string('record_number');
            $table->string('serial_number');
            $table->double('weight', 8, 2);
            $table->string('observation')->nullable(true);
            $table->string("image")->nullable(true);
            $table->unique(['tenant_id', 'name']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};
