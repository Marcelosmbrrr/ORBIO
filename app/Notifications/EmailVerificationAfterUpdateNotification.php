<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class EmailVerificationAfterUpdateNotification extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verificação do novo e-mail')
            ->line('Verificamos que o seu e-mail foi alterado. Por favor, clique no botão abaixo para verificar seu novo endereço de email.')
            ->action('Verificar Endereço de Email', $verificationUrl)
            ->line('Se você não atualizou o seu endereço de e-mail, entre em contato com o suporte.');
    }

    protected function verificationUrl($notifiable)
    {
        return URL::signedRoute(
            'verification.verify',
            ['id' => $notifiable->public_id, 'hash' => sha1($notifiable->getEmailForVerification())]
        );
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
