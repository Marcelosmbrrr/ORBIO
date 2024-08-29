<?php

use App\Models\User;

test('verified client can authenticate', function () {

    $user = User::factory()->client()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('service-orders.index', absolute: false));
});

test('unverified client cant authenticate', function () {

    $user = User::factory()->client()->unverified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => $user->password,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('deleted client cant authenticate', function () {

    $user = User::factory()->client()->deleted()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('client can not authenticate with invalid password', function () {
    
    $user = User::factory()->client()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('client can logout', function () {
    
    $user = User::factory()->client()->verified()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});
