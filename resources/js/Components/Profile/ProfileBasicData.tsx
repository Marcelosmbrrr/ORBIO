import * as React from 'react';
import { useForm, usePage } from '@inertiajs/react';

export function ProfileBasicData() {

    const { profile }: any = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        name: profile.data.basic.name,
        email: profile.data.basic.email
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/basic");
    };

    return (
        <form className="p-5 rounded-lg bg-white shadow dark:bg-gray-800" onSubmit={submit}>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Básico</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} id="name" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o nome" />
                    <span className='text-red-500 text-sm'>{errors.name}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cargo</label>
                    <input type="text" readOnly value={profile.data.basic.role} id="role" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                </div>
                <div className="sm:col-span-2">
                    <div className='mb-2'>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <span className='text-gray-400 text-sm'>Atenção: você será deslogado e terá que confirmar o e-mail novamente.</span>
                    </div>
                    <input type="text" value={data.email} onChange={e => setData('email', e.target.value)} id="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o e-mail" />
                    <span className='text-red-500 text-sm'>{errors.email}</span>
                </div>
                <div className="created_at">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Criado em</label>
                    <input type="text" readOnly value={profile.data.basic.created_at} id="created_at" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                </div>
                <div className="w-full">
                    <label htmlFor="updated_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Atualizado em</label>
                    <input type="text" readOnly value={profile.data.basic.update_at} id="updated_at" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
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