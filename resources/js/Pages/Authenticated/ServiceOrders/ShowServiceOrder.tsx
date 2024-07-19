import * as React from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { useSnackbar } from 'notistack';
import { MapIcon, Battery50Icon, BriefcaseIcon, DocumentIcon, DocumentChartBarIcon, PaperAirplaneIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { FlightPlanList } from '@/Components/ServiceOrders/Show/FlightPlanList';
import { DroneList } from '@/Components/ServiceOrders/Show/DroneList';
import { BatteryList } from '@/Components/ServiceOrders/Show/BatteryList';
import { EquipmentList } from '@/Components/ServiceOrders/Show/EquipmentList';
import { LogList } from '@/Components/ServiceOrders/Show/LogList';
import { ReportList } from '@/Components/ServiceOrders/Show/ReportList';
import { IncidentList } from '@/Components/ServiceOrders/Show/IncidentList';
import { ServiceOrderRecord } from './types';

type List = 'flightplans' | 'drones' | 'batteries' | 'equipments' | 'incidents' | 'logs' | 'reports';

const badges: { [key: string]: string } = {
    open: "bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-3 py-1 rounded dark:bg-yellow-900 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 text-md font-medium me-2 px-3 py-1 rounded dark:bg-green-900 dark:text-green-300",
    finished: "bg-blue-100 text-blue-800 text-md font-medium me-2 px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300",
    canceled: "bg-red-100 text-red-800 text-md font-medium me-2 px-3 py-1 rounded dark:bg-red-900 dark:text-red-300"
};

const ShowServiceOrder = React.memo(({ can, serviceorder }: { can: { edit: boolean, edit_log: boolean, edit_report: boolean }, serviceorder: { data: ServiceOrderRecord } }) => {

    const [list, setList] = React.useState<List>('flightplans');
    const [cancel, setCancel] = React.useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const { patch, setData, data, errors } = useForm({
        situation: '',
        observation: ''
    });

    const handleSelectList = React.useCallback((next_list: List) => {
        router.visit("/service-orders/" + serviceorder.data.id, {
            only: [next_list],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setList(next_list);
            }
        });
    }, []);

    React.useEffect(() => {
        if (data.situation !== "") {
            patch("/service-orders/" + serviceorder.data.id, {
                data,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setCancel(false);
                    enqueueSnackbar("Operação bem sucedida!", { variant: "success" });
                },
                onError: () => {
                    enqueueSnackbar("Erro!", { variant: "error" });
                }
            });
        }
    }, [data.situation]);

    const isListSelected = React.useCallback((current_list: List) => (
        current_list === list ?
            "inline-flex items-center justify-center p-4 text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 group"
            : "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:hover:text-gray-300 group"
    ), [list]);

    const actions = React.useCallback(() => {
        if (!can.edit) return "";

        if (cancel) {
            return (
                <div className='my-5'>
                    <div className='flex space-x-2 my-5'>
                        <button
                            type="button"
                            className={`flex items-center focus:outline-none text-white ${data.observation.length >= 10 ? 'bg-green-600 hover:bg-green-800' : 'bg-gray-200 dark:text-gray-700 dark:bg-gray-800'} font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                            onClick={() => data.observation.length >= 10 && setData("situation", "canceled")}
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => setCancel(false)}
                            type="button"
                            className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Cancelar
                        </button>
                    </div>
                    <div>
                        <textarea
                            id="observation"
                            value={data.observation}
                            onChange={e => setData('observation', e.target.value)}
                            rows={4}
                            className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Justifique o cancelamento (min 10 caracteres)"
                        />
                        <span className='text-red-500 text-sm'>{errors.observation}</span>
                    </div>
                </div>
            );
        }

        switch (serviceorder.data.situation.key) {
            case "open":
                return (
                    <div className='flex space-x-2 my-5'>
                        <button
                            onClick={() => setData("situation", "approved")}
                            type="button"
                            className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Aprovar
                        </button>
                        <button
                            onClick={() => setCancel(true)}
                            type="button"
                            className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Cancelar
                        </button>
                    </div>
                );
            case "approved":
                return (
                    <div className='flex space-x-2 my-5'>
                        <button
                            onClick={() => setData("situation", "finished")}
                            type="button"
                            className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Finalizar
                        </button>
                        <button
                            onClick={() => setCancel(true)}
                            type="button"
                            className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Cancelar
                        </button>
                    </div>
                );
            case "canceled":
                return (
                    <div className='my-5'>
                        <textarea
                            id="observation"
                            disabled
                            value={serviceorder.data.observation}
                            rows={4}
                            className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Justificativa do cancelamento"
                        />
                    </div>
                );
            default:
                return "";
        }
    }, [can.edit, cancel, data.observation, errors.observation, serviceorder.data.situation.key, setData]);

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
                <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
                    Visualizar
                </li>
            </ol>

            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <div className='my-5'>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            <span className={badges[serviceorder.data.situation.key]}>{serviceorder.data.situation.name}</span>
                        </h2>
                    </div>

                    <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Ordem de Serviço #{serviceorder.data.name}</h2>

                    <div>{actions()}</div>

                    <div>
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="pilot" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Piloto</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={serviceorder.data.pilot}
                                    id="pilot"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="client" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cliente</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={serviceorder.data.client}
                                    id="client"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="attendant" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Atendente</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={serviceorder.data.attendant}
                                    id="attendant"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="created_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Criado em</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={serviceorder.data.created_at}
                                    id="created_at"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="updated_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Atualizado em</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={serviceorder.data.updated_at}
                                    id="updated_at"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                        </div>

                        <div className='my-5'>
                            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Recursos</h2>
                        </div>

                        <div className="space-y-5 border-b border-gray-200 dark:border-gray-700">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                {['flightplans', 'drones', 'batteries', 'equipments', 'incidents', 'logs', 'reports'].map(item => (
                                    <li key={item} onClick={() => handleSelectList(item as List)} className="cursor-pointer">
                                        <span className={isListSelected(item as List)}>
                                            {item === 'flightplans' && <MapIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'drones' && <PaperAirplaneIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'batteries' && <Battery50Icon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'equipments' && <BriefcaseIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'incidents' && <ExclamationTriangleIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'logs' && <DocumentIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item === 'reports' && <DocumentChartBarIcon className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />}
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="text-medium text-gray-500 dark:text-gray-400 w-full">
                                {list === "flightplans" && <FlightPlanList />}
                                {list === "drones" && <DroneList />}
                                {list === "batteries" && <BatteryList />}
                                {list === "equipments" && <EquipmentList />}
                                {list === "incidents" && <IncidentList />}
                                {list === "logs" && <LogList />}
                                {list === "reports" && <ReportList />}
                            </div>
                        </div>

                        <div className='flex justify-end py-3'>
                            <Link href="/service-orders" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Voltar
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
});

export default ShowServiceOrder;
