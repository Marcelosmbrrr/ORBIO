<?php

namespace App\Listeners;

//use Illuminate\Contracts\Queue\ShouldQueue;
//use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Events\UserCreated;

class VerifyEmailAfterCreation
{
    /**
     * Handle the event.
     */
    public function handle(UserCreated $event): void
    {
        if ($event->user instanceof MustVerifyEmail && !$event->user->hasVerifiedEmail()) {
            $event->user->notify(new EmailVerificationNotification($event->password));
        }
    }
}
