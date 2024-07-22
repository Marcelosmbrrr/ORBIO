<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class EmailVerificationNotification extends Notification
{
    use Queueable;

    private string $password;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verificar Endereço de Email')
            ->subject('Senha: ' . $this->password)
            ->line('Por favor, clique no botão abaixo para verificar seu endereço de email.')
            ->action('Verificar Endereço de Email', $verificationUrl)
            ->line('Se você não criou uma conta, nenhuma ação adicional é necessária.');
    }

    protected function verificationUrl($notifiable)
    {
        return URL::signedRoute(
            'verification.verify',
            ['id' => $notifiable->public_id, 'hash' => sha1($notifiable->getEmailForVerification())]
        );
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
