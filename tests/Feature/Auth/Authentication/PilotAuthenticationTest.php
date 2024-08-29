<?php

use App\Models\User;

test('verified pilot can authenticate', function () {

    $user = User::factory()->pilot()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('service-orders.index', absolute: false));
});

test('unverified pilot cant authenticate', function () {

    $user = User::factory()->pilot()->unverified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => $user->password,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('deleted pilot cant authenticate', function () {

    $user = User::factory()->pilot()->deleted()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('pilot can not authenticate with invalid password', function () {
    
    $user = User::factory()->pilot()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('pilot can logout', function () {
    
    $user = User::factory()->pilot()->verified()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});
