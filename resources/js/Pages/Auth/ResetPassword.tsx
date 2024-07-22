import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }: { token: string, email: string }) {

    console.log(status)

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Alterar a Senha" />
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
                <div className="mt-4">
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <p className={'text-sm text-red-600 mt-2'}>
                        {errors.password}
                    </p>
                </div>
                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                        Digite a senha novamente
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <p className={'text-sm text-red-600 mt-2'}>
                        {errors.password_confirmation}
                    </p>
                </div>
                <div className="flex items-center justify-end mt-4">
                    <button
                        disabled={processing}
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-green-800 border border-transparent rounded-md text-sm font-medium text-white tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none"
                    >
                        {processing ? "Carregando..." : "Confirmar"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
