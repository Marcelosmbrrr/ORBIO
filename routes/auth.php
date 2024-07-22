<?php

use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerifyEmailController;

Route::middleware('guest')->group(function () {

    Route::get('login', [SessionController::class, 'create'])->name('login');

    Route::post('login', [SessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
     ->name('verification.verify')
     ->middleware(['signed', 'throttle:6,1']);

Route::middleware('auth')->group(function () {
    Route::post('logout', [SessionController::class, 'destroy'])
        ->name('logout');
});
