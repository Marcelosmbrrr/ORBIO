<?php

use App\Models\User;

test('verified manager can authenticate', function () {

    $user = User::factory()->manager()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('service-orders.index', absolute: false));
});

test('unverified manager cant authenticate', function () {

    $user = User::factory()->manager()->unverified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => $user->password,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('deleted manager cant authenticate', function () {

    $user = User::factory()->manager()->deleted()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('manager can not authenticate with invalid password', function () {
    
    $user = User::factory()->manager()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('manager can logout', function () {
    
    $user = User::factory()->manager()->verified()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});
