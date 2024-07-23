import * as React from 'react';
import { router, usePage } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { CreateServiceOrder } from '@/Components/ServiceOrders/CreateServiceOrder';
import { ShowServiceOrder } from '@/Components/ServiceOrders/ShowServiceOrder';
import { LimitSelector } from '@/Components/Shared/Pagination/LimitSelector';
import { OrderSelector } from '@/Components/Shared/Pagination/OrderSelector';
import { Alert } from '@/Components/Alert';
// Types
import { ServiceOrderSelected, ServiceOrderRecord } from './types';

type QueryParams = { page: number, search: string, order_by: string, limit: string, group: "all" | "open" | "approved" | "finished" | "canceled" };
const defaultParams: QueryParams = { page: 1, search: "", order_by: "id", limit: "10", group: "all" };

const statusClassName: { [key: string]: string } = {
    open: "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2",
    approved: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    canceled: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
    finished: "h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"
};

export default function ServiceOrders() {

    const { auth, data, queryParams = null, success }: any = usePage().props;

    const serviceOrders: ServiceOrderRecord[] = data.data;
    const meta = data.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] = React.useState<ServiceOrderSelected[]>([]);
    const [search, setSearch] = React.useState<string>("");

    const handleNavigation = React.useCallback((params: Partial<QueryParams>) => {
        setSelections([]);
        router.get("service-orders", { ...currentParams, ...params });
    }, [currentParams]);

    const handleSearchSubmit = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNavigation({ search });
        }
    }, [search]);

    const toggleSelection = (recordId: string) => {
        setSelections(prev => {
            const exists = prev.some(selection => selection.id === recordId);
            if (exists) {
                return prev.filter(selection => selection.id !== recordId);
            } else {
                const serviceOrder = serviceOrders.find(order => order.id === recordId);
                if (serviceOrder) {
                    const newSelection: ServiceOrderSelected = {
                        id: serviceOrder.id,
                        situation: {
                            name: serviceOrder.situation.name,
                            description: serviceOrder.situation.key // Assumindo que a descrição é a chave aqui.
                        }
                    };
                    return [...prev, newSelection];
                }
                return prev;
            }
        });
    };

    const isSelected = (recordId: string) => selections.some(selection => selection.id === recordId);
    const canOpenShow = selections.length === 1 && auth.user.authorization.serviceorders.read;

    return (
        <AuthenticatedLayout>
            <div className='flex flex-col h-full'>
                <Breadcrumb />
                <div className='grow py-5 rounded'>
                    {success &&
                        <Alert type='success' message={success} />
                    }
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearchSubmit} />
                        <ActionButtons
                            canCreate={selections.length === 0 && auth.user.authorization.serviceorders.create}
                            canShow={canOpenShow}
                            selections={selections}
                            reload={handleNavigation}
                            currentParams={currentParams}
                        />
                    </div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <FilterGroup currentGroup={currentParams.group} onChange={(group: "all" | "open" | "approved" | "finished" | "canceled") => handleNavigation({ group, page: 1 })} />
                    <ServiceOrderTable serviceOrders={serviceOrders} isSelected={isSelected} toggleSelection={toggleSelection} />
                    <PaginationInfo meta={meta} />
                    <Paginator current_page={meta.current_page} pages={meta.last_page} changePage={(page: number) => handleNavigation({ page })} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Breadcrumb = () => (
    <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
            <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                <svg className="flex-shrink-0 me-3 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
            </span>
            <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
            </svg>
        </li>
        <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
            Ordens de Serviço
        </li>
    </ol>
);

const SearchInput = ({ value, onChange, onSubmit }: { value: string, onChange: (value: string) => void, onSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void }) => (
    <div className="w-full md:w-1/2">
        <div>
            <label htmlFor="simple-search" className="sr-only">Pesquisar</label>
            <div className="relative w-full">
                <input
                    type="search"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={onSubmit}
                    placeholder="Pesquisar"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-900 dark:text-neutral-400 dark:placeholder-neutral-300 dark:focus:ring-blue-600"
                />
            </div>
        </div>
    </div>
);

const ActionButtons = ({ canCreate, canShow, selections, reload, currentParams }: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        <CreateServiceOrder can_open={canCreate} />
        <ShowServiceOrder can_open={canShow} selection={selections[0]} />
        <LimitSelector value={currentParams.limit} changeLimit={(limit: string) => reload({ limit })} />
        <OrderSelector value={currentParams.order_by} options={[{ id: "id", name: "criação" }, { id: "name", name: "nome" }]} changeOrderBy={(order_by: string) => reload({ order_by })} />
    </div>
);

const FilterGroup = ({ currentGroup, onChange }: { currentGroup: "all" | "open" | "approved" | "finished" | "canceled", onChange: (group: "all" | "open" | "approved" | "finished" | "canceled") => void }) => {
    const labels: { [key: string]: string } = {
        all: "Todas",
        open: "Abertas",
        approved: "Em Atendimento",
        finished: "Finalizadas",
        canceled: "Canceladas"
    };

    return (
        <div className='flex space-x-3'>
            <span className="font-medium text-gray-900 dark:text-white">Filtrar:</span>
            <div className="flex">
                {['all', 'open', 'approved', 'finished', 'canceled'].map(group => (
                    <div key={group} className="flex items-center me-4">
                        <input
                            checked={currentGroup === group}
                            onClick={() => onChange(group as "all" | "open" | "approved" | "finished" | "canceled")}
                            id={`inline-${group}-radio`}
                            type="radio"
                            name="inline-radio-group"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`inline-${group}-radio`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {labels[group]}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ServiceOrderTable = ({ serviceOrders, isSelected, toggleSelection }: any) => (
    <div className="mt-2 overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                            <input disabled type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </th>
                    <th scope="col" className="text-left px-6 py-3">Status</th>
                    <th scope="col" className="text-left px-6 py-3">Nome</th>
                    <th scope="col" className="text-left px-6 py-3">Atendente</th>
                    <th scope="col" className="text-left px-6 py-3">Piloto / Cliente</th>
                    <th scope="col" className="text-left px-6 py-3">Criado em</th>
                    <th scope="col" className="text-left px-6 py-3">Atualizado em</th>
                </tr>
            </thead>
            <tbody>
                {serviceOrders.length > 0 ? serviceOrders.map((order: ServiceOrderRecord) => (
                    <tr key={order.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                                <input
                                    checked={isSelected(order.id)}
                                    onChange={() => toggleSelection(order.id)}
                                    value={order.id}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            <div className="flex items-center text-gray-900 dark:text-white">
                                <div className={statusClassName[order.situation.key]}></div> {order.situation.name}
                            </div>
                        </td>
                        <td className="text-left px-6 py-4">{order.name}</td>
                        <td className="text-left px-6 py-4">{order.attendant ? order.attendant : "----"}</td>
                        <td className="flex flex-col space-y-2 px-6 py-4">
                            <div className='flex items-center'>
                                <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
                                    <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span>{order.pilot ?? "Sem Piloto"}</span>
                            </div>
                            <div className='flex items-center'>
                                <svg className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
                                    <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span>{order.client ?? "Sem Cliente"}</span>
                            </div>
                        </td>
                        <td className="text-left px-6 py-4">{order.created_at}</td>
                        <td className="text-left px-6 py-4">{order.updated_at}</td>
                    </tr>
                )) : (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={7} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">Nenhum registro encontrado.</div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const PaginationInfo = ({ meta }: { meta: any }) => (
    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Registros encontrados: <span className="mx-1 font-semibold text-gray-900 dark:text-white">{meta.total}</span> | Páginas: <span className="mx-1 font-semibold text-gray-900 dark:text-white">{meta.last_page}</span>
        </span>
    </nav>
);

const Paginator = ({ current_page, pages, changePage }: { current_page: number, pages: number, changePage: (page: number) => void }) => {
    const getPageNumbers = () => {
        if (pages <= 3) {
            return [...Array(pages)].map((_, i) => i + 1);
        }

        if (current_page <= 3) {
            return [1, 2, 3, pages];
        }

        if (current_page > 3 && current_page < pages - 2) {
            return [current_page - 1, current_page, current_page + 1, pages];
        }

        return [pages - 2, pages - 1, pages];
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="mt-4">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => changePage(1)}
                        className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        &laquo;
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => changePage(Math.max(current_page - 1, 1))}
                        className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        &lt;
                    </button>
                </li>
                {pageNumbers.map((page, i) => (
                    <li key={i}>
                        {i === 3 && pageNumbers.length > 3 && current_page <= pages - 3 ? (
                            <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">...</span>
                        ) : (
                            <button
                                onClick={() => changePage(page)}
                                className={`px-3 py-2 leading-tight ${current_page === page ? 'text-blue-600 bg-blue-50 dark:bg-gray-600 dark:text-white' : 'text-gray-500 bg-white dark:bg-gray-700 dark:text-gray-400'} border border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => changePage(Math.min(current_page + 1, pages))}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        &gt;
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => changePage(pages)}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};
