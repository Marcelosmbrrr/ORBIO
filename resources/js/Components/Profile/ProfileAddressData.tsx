import * as React from 'react';
import axios from 'axios';
import { useForm, usePage } from '@inertiajs/react';

export function ProfileAddressData() {

    const { profile }: any = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        zip_code: profile.data.address.zip_code,
        state: profile.data.address.state,
        city: profile.data.address.city,
        neighborhood: profile.data.address.neighborhood,
        street_name: profile.data.address.street_name,
        number: profile.data.address.number
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        patch("/profile/address", {
            preserveScroll: true
        });
    };

    async function searchAddressByCep() {

        const cep = data.zip_code;
        if (cep?.length != 8) {
            return;
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        // @ts-ignore
        setData({
            state: response.data.uf,
            city: response.data.localidade,
            neighborhood: response.data.bairro,
            street_name: response.data.logradouro
        });
    }

    return (
        <form className="p-5 row-span-2 rounded-lg bg-white shadow dark:bg-gray-800" onSubmit={submit}>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Endereço</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full">
                    <label htmlFor="zip_code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
                    <div className="relative">
                        <input
                            value={data.zip_code}
                            onChange={e => setData('zip_code', e.target.value)}
                            id="zip_code"
                            className="py-3 px-4 pr-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                            placeholder="Digite apenas números"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer bg-blue-500 rounded-r-lg hover:bg-blue-600" onClick={searchAddressByCep}>
                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <span className='text-red-500 text-sm'>{errors.zip_code}</span>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UF</label>
                    <input type="text" readOnly value={data.state} id="state" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                    <span className='text-red-500 text-sm'>{errors.state}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
                    <input type="text" readOnly value={data.city} id="city" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                    <span className='text-red-500 text-sm'>{errors.city}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="neighborhood" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bairro</label>
                    <input type="text" readOnly value={data.neighborhood} id="neighborhood" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                    <span className='text-red-500 text-sm'>{errors.neighborhood}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="street_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logradouro</label>
                    <input type="text" readOnly value={data.street_name} id="street_name" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                    <span className='text-red-500 text-sm'>{errors.street_name}</span>
                </div>
                <div className="w-full">
                    <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número de Endereço</label>
                    <input type="text" value={data.number} onChange={e => setData('number', e.target.value)} id="number" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o número" />
                    <span className='text-red-500 text-sm'>{errors.number}</span>
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