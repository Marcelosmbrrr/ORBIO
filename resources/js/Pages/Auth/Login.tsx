import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ success }: { success: string }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700">
                        Email
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
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700">
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

                <div className="block mt-4">
                    <label className="flex items-center">
                        <input
                            name="remember"
                            checked={data.remember}
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 text-sm"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Lembrar</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4 gap-x-3">
                    <Link
                        href={route('password.request')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none"
                    >
                        Esqueceu a senha?
                    </Link>
                    <button
                        disabled={processing}
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-green-800 border border-transparent rounded-md text-sm font-medium text-white tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none"
                    >
                        {processing ? "Carregando..." : "Acessar"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
