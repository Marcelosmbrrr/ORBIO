<?php

namespace App\Listeners;

use App\Events\UserEmailUpdated;
use App\Notifications\EmailVerificationAfterUpdateNotification;

class VerifyEmailAfterUpdate
{
    /**
     * Handle the event.
     */
    public function handle(UserEmailUpdated $event): void
    {
        $event->user->notify(new EmailVerificationAfterUpdateNotification());
    }
}
