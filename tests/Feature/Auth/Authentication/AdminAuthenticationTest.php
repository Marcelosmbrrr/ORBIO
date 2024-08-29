<?php

use App\Models\User;

test('admin can authenticate', function () {

    $user = User::factory()->admin()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('managers.index', absolute: false));
});

test('unverified admin cant authenticate', function () {

    $user = User::factory()->admin()->unverified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => '12345',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('admin can not authenticate with invalid password', function () {
    
    $user = User::factory()->admin()->verified()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email']);
});

test('admin can logout', function () {
    
    $user = User::factory()->admin()->verified()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});

test('admin can logout and login again', function () {
    
    $user = User::factory()->admin()->verified()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});