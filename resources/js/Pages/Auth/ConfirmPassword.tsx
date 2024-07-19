import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'));
    };

    return (
        <GuestLayout>
            <Head title="Confirmação da Senha" />

            <div className="mb-4 text-sm text-gray-600">
                This is a secure area of the application. Please confirm your password before continuing.
            </div>

            <form onSubmit={submit}>
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
