<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

test('reset password link screen can be rendered', function () {

    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
});

test('send a password reset link', function () {

    Notification::fake();

    $user = User::factory()->admin()->verified()->create();

    $this->post(route('password.email'), [
        'email' => $user->email,
    ])
    ->assertStatus(302)
    ->assertSessionHas('status', trans(Password::RESET_LINK_SENT));

    Notification::assertSentTo($user, ResetPassword::class);
});

test('fails to send a password reset link if email is invalid', function () {

    $this->post(route('password.email'), [
        'email' => 'invalid-email',
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email']);
});

test('fails to send a password reset link if user is not verified', function () {

    Notification::fake();

    // Cria um usuário não verificado
    $user = User::factory()->unverified()->create();

    $this->post(route('password.email'), [
        'email' => $user->email,
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email']); 
});

test('fails to send a password reset link if user is deleted', function () {

    Notification::fake();

    // Cria um usuário e executa soft delete
    $user = User::factory()->create();
    $user->delete();

    $this->post(route('password.email'), [
        'email' => $user->email,
    ])
    ->assertStatus(302)
    ->assertSessionHasErrors(['email']); 
});

