import * as React from 'react';
import { router, usePage } from '@inertiajs/react';
import { LimitSelector } from '@/Components/Shared/Pagination/LimitSelector';
import { PaginationMeta } from '@/types';

type QueryParams = { page: number, search: string, order_by: string, limit: string, group: "all" | "verified" | "unverified" }

const statusClassname: { [key: string]: string } = {
    active: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
};

const defaultParams: QueryParams = { page: 1, search: "", order_by: "id", limit: "10", group: "all" };

export const EquipmentStep: React.FC<{ selection: { id: string }[], setData: Function }> = ({ selection, setData }) => {

    const { equipments, queryParams = null } = usePage().props as any;
    const data = equipments.data;
    const meta = equipments.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] = React.useState<{ id: string }[]>(selection);
    const [processing, setProcessing] = React.useState(false);
    const [search, setSearch] = React.useState<string>("");

    const fetchData = React.useCallback((params: Partial<QueryParams>) => {
        setProcessing(true);
        const newParams = { ...currentParams, ...params };
        router.visit("/service-orders/create", {
            only: ['equipments'],
            data: newParams,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setProcessing(false),
            onError: () => setProcessing(false)
        });
    }, [currentParams]);

    const handleSearchSubmit = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            fetchData({ search });
        }
    }, [search]);

    const onSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedRecordId = e.target.value;
        const clone = [...selections];
        const recordIndex = clone.findIndex((selection) => selection.id === selectedRecordId);

        if (recordIndex !== -1) {
            clone.splice(recordIndex, 1);
        } else {
            const record = data.find((equipment: any) => equipment.id === selectedRecordId);
            if (record) {
                clone.push({ id: record.id });
            }
        }

        setSelections(clone);
        setData('equipments', clone);
    }, [selections, data]);

    const isRowSelected = React.useCallback((record_id: string): boolean => {
        return selections.some((selection) => selection.id === record_id);
    }, [selections]);

    return (
        <>
            <div className='mb-5'>
                <h2 className="mb-4 text-md font-bold text-gray-900 dark:text-white">Equipamento (opcional)</h2>
                <p className="text-gray-500 dark:text-gray-400">Seleções: {selections.length}</p>
            </div>

            <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                <SearchInput value={search} onChange={setSearch} onSubmit={handleSearchSubmit} />
                <ActionButtons
                    selections={selections}
                    reload={fetchData}
                    currentParams={currentParams}
                />
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
            <EquipmentsTable
                data={data}
                processing={processing}
                onSelect={onSelect}
                isRowSelected={isRowSelected}
            />
            <PaginationInfo meta={meta} />
            <Paginator current_page={meta.current_page} pages={meta.last_page} changePage={(page: number) => fetchData({ page })} />
        </>
    );
};

const EquipmentsTable = ({ data, processing, onSelect, isRowSelected }: any) => (
    <div className="mt-2 overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                            <input
                                disabled
                                onChange={onSelect}
                                value="all"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </th>
                    <th scope="col" className="text-left px-6 py-3">Status</th>
                    <th scope="col" className="text-left px-6 py-3">Nome</th>
                    <th scope="col" className="text-left px-6 py-3">Fabricante</th>
                    <th scope="col" className="text-left px-6 py-3">Modelo</th>
                    <th scope="col" className="text-left px-6 py-3">Número de Registro</th>
                    <th scope="col" className="text-left px-6 py-3">Número Serial</th>
                    <th scope="col" className="text-left px-6 py-3">Peso</th>
                </tr>
            </thead>
            <tbody>
                {!processing && data.length > 0 && data.map((equipment: any) => (
                    <tr key={equipment.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                                <input
                                    checked={isRowSelected(equipment.id)}
                                    onChange={onSelect}
                                    value={equipment.id}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </th>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center text-gray-900 dark:text-white">
                                <div className={statusClassname[equipment.status.style_key]}></div> {equipment.status.title}
                            </div>
                        </th>
                        <td className="text-left px-6 py-4">{equipment.name}</td>
                        <td className="text-left px-6 py-4">{equipment.manufacturer}</td>
                        <td className="text-left px-6 py-4">{equipment.model}</td>
                        <td className="text-left px-6 py-4">{equipment.record_number}</td>
                        <td className="text-left px-6 py-4">{equipment.serial_number}</td>
                        <td className="text-left px-6 py-4">{equipment.weight}</td>
                    </tr>
                ))}

                {!processing && data.length === 0 && (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">
                                Nenhum registro encontrado.
                            </div>
                        </td>
                    </tr>
                )}

                {processing && (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">
                                Carregando...
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const PaginationInfo = ({ meta }: { meta: PaginationMeta }) => (
    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Registros encontrados: <span className="mx-1 font-semibold text-gray-900 dark:text-white">{meta.total}</span> | Páginas: <span className="mx-1 font-semibold text-gray-900 dark:text-white">{meta.last_page}</span>
        </span>
    </nav>
);

const ActionButtons = ({ reload, currentParams }: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        <LimitSelector value={currentParams.limit} changeLimit={(limit: string) => reload({ limit })} />
    </div>
);

const SearchInput = ({ value, onChange, onSubmit }: { value: string, onChange: (value: string) => void, onSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void }) => (
    <div className="w-full md:w-1/2">
        <div>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <input
                    type="search"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={onSubmit}
                    placeholder="Pesquisar"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-blue-600"
                />
            </div>
        </div>
    </div>
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