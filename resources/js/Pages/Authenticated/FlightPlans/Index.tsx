import * as React from 'react';
import JSZip from 'jszip';
import { router, usePage } from "@inertiajs/react";
import { useSnackbar } from 'notistack';
// Custom
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { CreateFlightPlan } from '@/Components/FlightPlans/CreateFlightPlan';
import { EditFlightPlan } from '@/Components/FlightPlans/EditFlightPlan';
import { ShowFlightPlan } from '@/Components/FlightPlans/ShowFlightPlan';
import { DeleteOrUndeleteResource } from '@/Components/Shared/Modal/DeleteOrUndeleteResource';
import { LimitSelector } from '@/Components/Shared/Pagination/LimitSelector';
import { OrderSelector } from '@/Components/Shared/Pagination/OrderSelector';
// Types
import { FlightPlanSelected, FlightPlanRecord } from './types';

type QueryParams = { page: number, search: string, order_by: string, limit: string, group: "all" | "active" | "deleted" };
const defaultParams: QueryParams = { page: 1, search: "", order_by: "id", limit: "10", group: "all" };

const statusClassname: { [key: string]: string } = {
    active: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
};

export default function FlightPlans() {

    const { auth, data, queryParams = null, success }: any = usePage().props;
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        if (success) {
            setSelections([]);
            enqueueSnackbar(success, { variant: "success" });
        }
    }, [success]);

    const flightplans: FlightPlanRecord[] = data.data;
    const meta = data.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] = React.useState<FlightPlanSelected[]>([]);
    const [search, setSearch] = React.useState<string>("");

    const handleNavigation = React.useCallback((params: Partial<QueryParams>) => {
        setSelections([]);
        router.get("flight-plans", { ...currentParams, ...params });
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
                const flightplan = flightplans.find(flightplan => flightplan.id === recordId);
                if (flightplan) {
                    const newSelection: FlightPlanSelected = {
                        id: flightplan.id,
                        is_deleted: Boolean(flightplan.deleted_at)
                    };
                    return [...prev, newSelection];
                }
                return prev;
            }
        });
    };

    const isSelected = (recordId: string) => selections.some(selection => selection.id === recordId);
    const canOpenDeleteOrUndelete = selections.length > 0 && auth.user.authorization.flightplans.write && selections.every(sel => sel.is_deleted === selections[0].is_deleted);

    const handleExport = (name: string, { single, multi }: { single: string, multi: string[] }) => {
        const zip = new JSZip();
        const sfolder = zip.folder('single');
        sfolder?.file(`${name}.txt`, single);

        const mfolder = zip.folder('multi');
        multi.forEach((content, index) => {
            mfolder?.file(`${index}_${name}.txt`, content);
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}.zip`);
            document.body.appendChild(link);
            link.click();
        });
    };

    return (
        <AuthenticatedLayout>
            <div className='flex flex-col h-full'>
                <Breadcrumb />
                <div className='grow py-5 rounded'>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearchSubmit} />
                        <ActionButtons
                            canCreate={selections.length === 0 && auth.user.authorization.flightplans.write}
                            canEdit={selections.length === 1 && auth.user.authorization.flightplans.write}
                            canShow={selections.length === 1 && auth.user.authorization.flightplans.read}
                            canDeleteOrUndelete={canOpenDeleteOrUndelete}
                            selections={selections}
                            reload={handleNavigation}
                            currentParams={currentParams}
                        />
                    </div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <FilterGroup currentGroup={currentParams.group} onChange={(group: "all" | "active" | "deleted") => handleNavigation({ group, page: 1 })} />
                    <FlightPlanTable flightplans={flightplans} isSelected={isSelected} toggleSelection={toggleSelection} handleExport={handleExport} />
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
            Planos de voo
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

const ActionButtons = ({ canCreate, canEdit, canShow, canDeleteOrUndelete, selections, reload, currentParams }: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        <CreateFlightPlan can_open={canCreate} />
        <EditFlightPlan can_open={canEdit} selection={selections[0]} />
        <ShowFlightPlan can_open={canShow} selection={selections[0]} />
        <DeleteOrUndeleteResource
            can_open={canDeleteOrUndelete}
            reload={reload}
            action={currentParams.group === "deleted" ? "undelete" : "delete"}
            request_url={currentParams.group === "deleted"
                ? `/actions/undelete/flight_plans?ids=${selections.map((selection: any) => selection.id).join(',')}`
                : `/flight-plans/delete-many?ids=${selections.map((selection: any) => selection.id).join(',')}`
            }
        />
        <LimitSelector value={currentParams.limit} changeLimit={(limit: string) => reload({ limit })} />
        <OrderSelector value={currentParams.order_by} options={[{ id: "id", name: "criação" }, { id: "name", name: "nome" }]} changeOrderBy={(order_by: string) => reload({ order_by })} />
    </div>
);

const FilterGroup = ({ currentGroup, onChange }: { currentGroup: "all" | "active" | "deleted", onChange: (group: "all" | "active" | "deleted") => void }) => {
    const labels: { [key: string]: string } = {
        all: "Todos",
        active: "Ativos",
        deleted: "Deletados"
    };

    return (
        <div className='flex space-x-3'>
            <span className="font-medium text-gray-900 dark:text-white">Filtrar:</span>
            <div className="flex">
                {['all', 'active', 'deleted'].map(group => (
                    <div key={group} className="flex items-center me-4">
                        <input
                            checked={currentGroup === group}
                            onClick={() => onChange(group as "all" | "active" | "deleted")}
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

const FlightPlanTable = ({ flightplans, isSelected, toggleSelection, handleExport }: any) => (
    <div className="mt-2 overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                            <input disabled type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </th>
                    <th scope="col" className="text-left px-6 py-3">Nome</th>
                    <th scope="col" className="text-left px-6 py-3">Estado</th>
                    <th scope="col" className="text-left px-6 py-3">Cidade</th>
                    <th scope="col" className="text-left px-6 py-3">Status</th>
                    <th scope="col" className="text-right px-6 py-3">Exportar</th>
                </tr>
            </thead>
            <tbody>
                {flightplans.length > 0 ? flightplans.map((flightplan: FlightPlanRecord) => (
                    <tr key={flightplan.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                                <input
                                    checked={isSelected(flightplan.id)}
                                    onChange={() => toggleSelection(flightplan.id)}
                                    value={flightplan.id}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </th>
                        <td className="text-left px-6 py-4">{flightplan.name}</td>
                        <td className="text-left px-6 py-4">{flightplan.state}</td>
                        <td className="text-left px-6 py-4">{flightplan.city}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center text-gray-900 dark:text-white">
                                <div className={statusClassname[flightplan.status.style_key]}></div> {flightplan.status.title}
                            </div>
                        </td>
                        <td className="flex justify-end px-6 py-4">
                            <button onClick={() => handleExport(flightplan.name, flightplan.file)}>
                                <svg className="flex-shrink-0 w-5 h-5 text-green-600 transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap dark:text-white">
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
