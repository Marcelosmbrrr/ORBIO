<?php

use Illuminate\Support\Facades\Route;
// Controllers
use App\Http\Controllers\Manager\ManagerController;
use App\Http\Controllers\Pilot\PilotController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\ServiceOrders\ServiceOrderController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Logs\LogController;
use App\Http\Controllers\Incidents\IncidentController;
use App\Http\Controllers\FlightPlans\FlightPlanController;
use App\Http\Controllers\Drones\DroneController;
use App\Http\Controllers\Batteries\BatteryController;
use App\Http\Controllers\Equipments\EquipmentController;
use App\Http\Controllers\Profile\ProfileController;
// Actions
use App\Http\Controllers\Shared\RevertDeletionController;

Route::redirect("/", "/login");

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin
    Route::resource("managers", ManagerController::class)->names('managers');
    // Users
    Route::resource("pilots", PilotController::class)->names('pilots');
    Route::resource("clients", ClientController::class)->names('clients');
    // Service Orders
    Route::resource("service-orders", ServiceOrderController::class)->names('service-orders');
    Route::resource("service-orders/{service_order}/reports", ReportController::class)->only(['store', 'create', 'destroy'])->names('reports');
    Route::resource("service-orders/{service_order}/logs", LogController::class)->only(['show', 'store', 'create', 'destroy'])->names('logs');
    Route::resource("service-orders/{service_order}/incidents", IncidentController::class)->only(['store', 'create', 'edit', 'update', 'destroy'])->names('incidents');
    // Flight plans
    Route::resource("flight-plans", FlightPlanController::class)->names('flight-plans');
    // Equipments
    Route::resource("drones", DroneController::class)->names('drones');
    Route::resource("batteries", BatteryController::class)->names('batteries');
    Route::resource("equipments", EquipmentController::class)->names('equipments');
    // Profile
    Route::get("profile", [ProfileController::class, "index"])->name('profile.index');
    Route::patch("profile/basic", [ProfileController::class, "updateBasic"]);
    Route::patch("profile/document", [ProfileController::class, "updateDocument"]);
    Route::patch("profile/address", [ProfileController::class, "updateAddress"]);
    Route::patch("profile/contact", [ProfileController::class, "updateContact"]);
    Route::patch("profile/change-password", [ProfileController::class, "updatePassword"]);
    Route::patch("profile/deactivate", [ProfileController::class, "deactivateAccount"]);
    // Actions
    Route::patch("actions/undelete/{table}", RevertDeletionController::class);
    Route::view("actions/map", "map-visualization");
});

require __DIR__ . '/auth.php';
