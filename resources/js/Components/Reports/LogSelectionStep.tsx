import * as React from 'react';
import { usePage, router } from '@inertiajs/react';
import { SelectedLog } from '@/Pages/Authenticated/Reports/CreateReport';

type QueryParams = { page: number, search: string, order_by: string, limit: string }
const defaultParams: QueryParams = { page: 1, search: "", order_by: "id", limit: "10" };

export function LogSelectionStep(props: { logs: SelectedLog[], setLogs: Function }) {

    const { logs, queryParams = null }: any = usePage().props;
    const selections = props.logs;
    const currentParams: QueryParams = Object.assign({}, defaultParams, queryParams);
    const [search, setSearch] = React.useState<string>("");

    function changePage(page: number) {
        currentParams["page"] = page;
        router.get("managers", currentParams);
    }

    function changeOrderBy(orderBy: string) {
        currentParams["order_by"] = orderBy;
        router.get("managers", currentParams);
    }

    function changeLimit(limit: string) {
        currentParams["limit"] = limit;
        router.get("managers", currentParams);
    }

    function submitSearch(e: any) {
        if (e.key === 'Enter') {
            currentParams["search"] = search;
            router.get("managers", currentParams);
        }
    }

    function onSelect(e: any) {
        const selected_record_id = e.target.value;

        // Remove selected record if already exists 
        const find_record_index = selections.findIndex((selection) => selection.id === selected_record_id);
        if (Boolean(find_record_index + 1)) {
            const clone = JSON.parse(JSON.stringify(selections));
            clone.splice(find_record_index, 1);
            props.setLogs(clone);
            return;
        }

        // Push selected record if not exists
        const record = logs.data.filter((selection: any) => selection.id === selected_record_id)[0];
        const record_data = {
            id: record.id,
            name: record.name,
            contents: record.contents,
            met_data: {
                temperature: { initial: "", final: "" },
                humidity: { initial: "", final: "" },
                wind_speed: { initial: "", final: "" }
            }
        };

        const clone = JSON.parse(JSON.stringify(selections));
        clone.push(record_data);
        props.setLogs(clone);
    }

    function isRowSelected(record_id: string): boolean {
        const find_record_index = selections.findIndex((selection) => selection.id === record_id);
        return Boolean(find_record_index + 1); // Boolean(index + 1) or Boolean(-1 + 1)
    }

    return (
        <>
            <div className='mb-3'>
                <h2 className="mb-2 text-md font-bold text-gray-900 dark:text-white">Seleção de Log</h2>
                <p className="text-gray-500 dark:text-gray-400">Seleções: {selections.length} </p>
            </div>

            <div className="w-full mb-3 md:w-1/2">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input type="search" onKeyDown={submitSearch} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar log" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    <input disabled value="all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </th>
                            <th scope="col" className="text-left px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="text-left px-6 py-3">
                                Criado em
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {logs.data.length > 0 && logs.data.map((log: any) =>
                            <tr key={log.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <input checked={isRowSelected(log.id)} onChange={onSelect} value={log.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                </th>
                                <td className="text-left px-6 py-4">
                                    {log.name}
                                </td>
                                <td className="text-left px-6 py-4">
                                    {log.created_at}
                                </td>
                            </tr>
                        )}

                        {logs.data.length === 0 && <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                <div className="flex items-center justify-center">
                                    Nenhum log registrado.
                                </div>
                            </td>
                        </tr>
                        }

                    </tbody>
                </table>
            </div>
        </>
    )

}