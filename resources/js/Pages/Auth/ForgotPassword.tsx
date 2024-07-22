import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Alert } from '@/Components/Alert';

export default function ForgotPassword({ status }: { status?: string }) {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Esqueceu a Senha" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Esqueceu a senha? Informe o e-mail cadastrado abaixo para receber o link de recuperação da sua conta.
            </div>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <p className={'text-sm text-red-600 mt-2'}>
                        {errors.email}
                    </p>
                </div>

                <div className="flex items-center justify-end mt-4 gap-x-3">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 dark:text-white hover:text-gray-900 rounded-md focus:outline-none"
                    >
                        Voltar
                    </Link>
                    <button
                        disabled={processing}
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-green-800 border border-transparent rounded-md text-sm font-medium text-white tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none"
                    >
                        {processing ? "Carregando..." : "Confirmar"}
                    </button>
                </div>
            </form>

            {status && (
                <Alert message={status} type='success' />
            )
            }
        </GuestLayout>
    );
}
