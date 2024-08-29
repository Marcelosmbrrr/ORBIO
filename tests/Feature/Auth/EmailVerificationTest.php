<?php

use Illuminate\Support\Facades\URL;
use App\Models\User;

test('email can be verified', function () {

    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->public_id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect(route('login', absolute: false));
});

it('redirects to login with an error if the account is deactivated', function () {

    $user = User::factory()->admin()->verified()->deleted()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->public_id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('error', 'O e-mail pertence a uma conta desativada');
});


it('redirects to login with an error if the email is already verified', function () {

    $user = User::factory()->admin()->verified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->public_id, 'hash' => sha1($user->email)] 
    );

    $response = $this->actingAs($user)->get($url);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('error', 'O e-mail já foi confirmado');
});


it('redirects to login with success if the email is successfully verified', function () {

    $user = User::factory()->admin()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->public_id, 'hash' => sha1($user->email)] 
    );

    $response = $this->actingAs($user)->get($url);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('success', 'O e-mail foi confirmado');

    $this->assertNotNull($user->fresh()->email_verified_at);
});

