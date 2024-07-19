import * as React from 'react';
import { useForm } from '@inertiajs/react';

export function ProfileChangePassword() {

    const { data, setData, patch, processing, errors, reset } = useForm({
        password: "",
        new_password: "",
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/change-password", {
            preserveScroll: true
        });
        reset();
    };

    return (
        <form className="p-5 rounded-lg bg-white shadow dark:bg-gray-800" onSubmit={submit}>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Alterar Senha</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha Atual</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} id="current_password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a senha atual" />
                    <span className='text-red-500 text-sm'>{errors.password}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nova Senha</label>
                    <input type="password" value={data.new_password} onChange={e => setData('new_password', e.target.value)} id="new_password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a nova senha" />
                    <span className='text-red-500 text-sm'>{errors.new_password}</span>
                </div>
            </div>
            <div className='text-right'>
                <button disabled={processing} type="submit" className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    {processing ? "Carregando ..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    )
}