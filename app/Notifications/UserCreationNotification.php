<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreationNotification extends Notification
{
    use Queueable;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('ORDRONE - ATIVAÇÃO DA CONTA')
            ->greeting("Bem vindo " . $notifiable->first_name . "!")
            ->line("Dados de acesso:")
            ->line("Email: " . $notifiable->email)
            ->line("Senha: " . $this->password)
            ->line("Para acessar é preciso verificar o seu e-mail. Para isso clique no botão abaixo.")
            ->action('Verificar E-mail', url("/auth/email-verification/" . $notifiable->public_id));
    }
}
