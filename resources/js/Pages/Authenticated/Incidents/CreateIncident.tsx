import * as React from 'react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import { useSnackbar } from 'notistack';

interface Props {
    service_order_id: string;
}

export default function CreateIncident(props: Props) {

    const { enqueueSnackbar } = useSnackbar();

    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        description: '',
        date: ''
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        const url = window.location.pathname.replace("/create", "");
        post(url, {
            onError: (e) => {
                ///console.log(e)
                enqueueSnackbar("Erro ao criar o incidente!", { variant: "error" });
            }
        });
    };

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
                        Ordens de Serviço
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Incidentes
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
                    Criar
                </li>
            </ol>

            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Criar Incidente</h2>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo</label>
                                <input type="text" value={data.type} onChange={e => setData('type', e.target.value)} id="type" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe o tipo" />
                                <span className='text-red-500 text-sm'>{errors.type}</span>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                                <input type="text" value={data.description} onChange={e => setData('description', e.target.value)} id="description" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" placeholder="Informe a descrição" />
                                <span className='text-red-500 text-sm'>{errors.description}</span>
                            </div>
                            <div className="w-fit">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data</label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} id="date" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600" />
                                <span className='text-red-500 text-sm'>{errors.date}</span>
                            </div>
                        </div>
                        <div className='flex justify-end py-3'>
                            <Link href={route('service-orders.show', { id: props.service_order_id })} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
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