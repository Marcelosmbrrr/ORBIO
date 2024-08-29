<?php

test('user is redirected for login from root', function () {

    $response = $this->get('/');

    $response->assertRedirect('/login');
});

test('login screen can be rendered', function () {

    $response = $this->get('/login');

    $response->assertStatus(200);
});
