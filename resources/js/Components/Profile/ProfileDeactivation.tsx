import * as React from 'react';
import { useForm } from '@inertiajs/react';

export function ProfileDeactivation() {

    const { data, setData, patch, processing, errors } = useForm({
        password: ""
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/deactivate", {
            preserveScroll: true
        });
    };

    return (
        <form className="p-5 rounded-lg bg-white shadow dark:bg-gray-800" onSubmit={submit}>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Desativar a Conta</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-3">
                <div className="w-full">
                    <label htmlFor="password" className="block mb-2 text-sm text-gray-900 dark:text-white">Se você tem certeza, por favor insira sua senha abaixo para confirmar:</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} id="uf" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a senha" />
                    <span className='text-red-500 text-sm'>{errors.password}</span>
                </div>
            </div>
            <div className='text-right'>
                <button type="submit" className="mt-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    {processing ? "Carregando ..." : "Desativar"}
                </button>
            </div>
        </form>
    )
}