import * as React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { useSnackbar } from 'notistack';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';

export default function EditBattery({ battery }: any) {

    const { enqueueSnackbar } = useSnackbar();

    const { data, setData, patch, processing, errors } = useForm({
        name: battery.name,
        manufacturer: battery.manufacturer,
        model: battery.model,
        serial_number: battery.serial_number,
        last_charge: battery.last_charge,
        image: battery.image_url,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/batteries/" + battery.id, {
            onError: () => {
                enqueueSnackbar("Erro ao editar o bateria!", { variant: "error" });
            }
        });
    };

    function onChangeImage(e: any) {
        const uploaded_file = e.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            const imgURL = URL.createObjectURL(uploaded_file);
            setData('image', uploaded_file);
        }
    }

    return (
        <AuthenticatedLayout>

            <ol className="flex items-center whitespace-nowrap">
                <li className="inline-flex items-center">
                    <a className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        <svg className="flex-shrink-0 me-3 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                    <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Equipamentos
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Baterias
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
                    Editar
                </li>
            </ol>

            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Bateria</h2>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} id="name" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o nome" />
                                <span className='text-red-500 text-sm'>{errors.name}</span>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="manufacturer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fabricante</label>
                                <input type="text" value={data.manufacturer} onChange={e => setData('manufacturer', e.target.value)} id="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o fabricante" />
                                <span className='text-red-500 text-sm'>{errors.manufacturer}</span>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Modelo</label>
                                <input type="text" value={data.model} onChange={e => setData('model', e.target.value)} id="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o modelo" />
                                <span className='text-red-500 text-sm'>{errors.model}</span>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="serial_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número Serial</label>
                                <input type="text" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} id="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o número serial" />
                                <span className='text-red-500 text-sm'>{errors.serial_number}</span>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Última Carga</label>
                                <input type="date" value={data.last_charge} onChange={e => setData('last_charge', e.target.value)} id="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                                <span className='text-red-500 text-sm'>{errors.last_charge}</span>
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Imagem (JPG)</label>
                                <input onChange={onChangeImage} accept=".jpg, .jpeg" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
                                <span className='text-red-500 text-sm'>{errors.image}</span>
                            </div>
                        </div>
                        <div className='flex justify-end py-3'>
                            <Link href={route('batteries.index')} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Voltar
                            </Link>
                            <button disabled={processing} type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                {processing ? "Carregando ..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}