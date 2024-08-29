<?php

use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

it('displays the password reset view', function () {

    $token = 'some-valid-token';
    $email = 'test@example.com';

    $this->get(route('password.reset', ['token' => $token, 'email' => $email]))
        ->assertStatus(200);
});

it('resets the password successfully', function () {

    Event::fake();

    $user = User::factory()->admin()->verified()->create();

    $token = Password::createToken($user);

    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])
    ->assertStatus(302)
    ->assertSessionHas('status', trans(Password::PASSWORD_RESET));

    $this->assertTrue(Hash::check('new-password', $user->fresh()->password));

    Event::assertDispatched(PasswordReset::class);
});

it('fails to reset the password with invalid data', function () {

    $this->post(route('password.store'), [
        'token' => 'invalid-token',
        'email' => 'invalid-email',
        'password' => 'short',
        'password_confirmation' => 'different',
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email', 'password']);
});

it('fails to reset the password if token is expired', function () {

    Event::fake();

    $user = User::factory()->admin()->verified()->create();

    $token = Password::createToken($user);

    // Advances time by more than 60 minutes (default time to expiration)
    Carbon::setTestNow(Carbon::now()->addMinutes(61));

    // Tries to redefine the password with the expired token
    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email' => trans(Password::INVALID_TOKEN)]);
});

it('fails to reset the password if the token has already been used', function () {

    Event::fake();

    $user = User::factory()->admin()->verified()->create();

    $token = Password::createToken($user);

    // Simulates the first password reset, which should succeed
    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])
    ->assertStatus(302)
    ->assertSessionHas('status', trans(Password::PASSWORD_RESET));

    // Checks if the password reset event has been triggered
    Event::assertDispatched(PasswordReset::class);

    // Tries to reset the password again with the same token, which should fail
    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'another-password',
        'password_confirmation' => 'another-password',
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email' => trans(Password::INVALID_TOKEN)]);
});


