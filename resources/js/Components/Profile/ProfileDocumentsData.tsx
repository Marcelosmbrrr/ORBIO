import * as React from 'react';
import { useForm, usePage } from '@inertiajs/react';

export function ProfileDocumentalData() {

    const { profile }: any = usePage().props;

    const { data, setData, patch, errors, processing } = useForm({
        cpf: profile.data.documents.cpf,
        cnpj: profile.data.documents.cnpj,
        company_name: profile.data.documents.company_name,
        trading_name: profile.data.documents.trading,
        anac_license: profile.data.documents.anac_license
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/document");
    }

    return (
        <form className="p-5 rounded-lg bg-white shadow dark:bg-gray-800 h-fit" onSubmit={submit}>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Documentos</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

                <div className="w-full">
                    <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                    <input type="text" value={data.cpf} name='cpf' onChange={e => setData('cpf', e.target.value)} id="cpf" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o CPF" />
                    <span className='text-red-500 text-sm'>{errors.cpf}</span>
                </div>

                {!!profile.data.field_control.cnpj &&
                    <div className="w-full">
                        <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CNPJ</label>
                        <input name="cnpj" type="text" value={data.cnpj} onChange={e => setData('cnpj', e.target.value)} id="cnpj" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o CNPJ" />
                        <span className='text-red-500 text-sm'>{errors.cnpj}</span>
                    </div>
                }

                {!!profile.data.field_control.company_name &&
                    <div className="w-full">
                        <label htmlFor="company_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Fantasia</label>
                        <input name="company_name" type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} id="company_name" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o nome fantasia" />
                        <span className='text-red-500 text-sm'>{errors.company_name}</span>
                    </div>
                }

                {!!profile.data.field_control.trading_name &&
                    <div className="w-full">
                        <label htmlFor="trading_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razão Social</label>
                        <input name="trading_name" type="text" value={data.trading_name} onChange={e => setData('trading_name', e.target.value)} id="trading_name" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a razão social" />
                        <span className='text-red-500 text-sm'>{errors.trading_name}</span>
                    </div>
                }

                {!!profile.data.field_control.anac_license &&
                    <div className="w-full">
                        <label htmlFor="anac_license" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Licença Anac</label>
                        <input name="anac_license" type="text" value={data.anac_license} onChange={e => setData('anac_license', e.target.value)} id="anac_license" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a licença anac" />
                        <span className='text-red-500 text-sm'>{errors.anac_license}</span>
                    </div>
                }

            </div>
            <div className='text-right'>
                <button disabled={processing} type="submit" className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    {processing ? "Carregando ..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    )
}