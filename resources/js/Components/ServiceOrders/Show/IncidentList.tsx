import * as React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { DeleteOrUndeleteResource } from '@/Components/Shared/Modal/DeleteOrUndeleteResource';

export function IncidentList() {

    const { incidents, can, queryParams = null }: any = usePage().props;
    const [selections, setSelections] = React.useState<{ id: string }[]>([]);

    function onSelect(e: any) {
        const selected_record_id = e.target.value;

        // Remove selected record if already exists 
        const find_record_index = selections.findIndex((selection) => selection.id === selected_record_id);
        if (Boolean(find_record_index + 1)) {
            const clone = JSON.parse(JSON.stringify(selections));
            clone.splice(find_record_index, 1);
            setSelections(clone);
            return;
        }

        // Push selected record if not exists
        const record = incidents.data.filter((selection: any) => selection.id === selected_record_id)[0];
        const record_data = {
            id: record.id,
        }

        const clone = JSON.parse(JSON.stringify(selections));
        clone.push(record_data);
        setSelections(clone);
    }

    function isRowSelected(record_id: string): boolean {
        const find_record_index = selections.findIndex((selection) => selection.id === record_id);
        return Boolean(find_record_index + 1); // Boolean(index + 1) or Boolean(-1 + 1)
    }

    function reload(params: any) {
        setSelections([]);
        //router.get("administration", Object.assign({}, currentParams, params));
    }

    return (
        <div className="relative overflow-x-auto space-y-3">

            {can.edit_log &&
                <div className="flex justify-start flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
                    <Link href={window.location.pathname + "/incidents/create"}>
                        <button className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                            </svg>
                            <span>Criar</span>
                        </button>
                    </Link>
                    {selections.length === 1 &&
                        <Link href={window.location.pathname + "/incidents/" + selections[0].id + "/edit"}>
                            <button className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                                </svg>
                                <span>Editar</span>
                            </button>
                        </Link>
                    }
                    <DeleteOrUndeleteResource
                        can_open={can.edit_log && selections.length > 0}
                        reload={reload}
                        action={"delete"}
                        request_url={window.location.pathname + "/incidents/delete-many?ids=" + selections.map((selection) => selection.id).join(',')}
                    />
                </div>

            }

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                <input disabled value="all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Tipo
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Descrição
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Data
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {incidents.data.length > 0 && incidents.data.map((incident: any) =>
                        <tr key={incident.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <div className="flex items-center">
                                    <input checked={isRowSelected(incident.id)} onChange={onSelect} value={incident.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </th>
                            <td className="text-left px-6 py-4">
                                {incident.type}
                            </td>
                            <td className="text-left px-6 py-4">
                                {incident.description}
                            </td>
                            <td className="text-left px-6 py-4">
                                {incident.date}
                            </td>
                        </tr>
                    )}

                    {incidents.data.length === 0 && <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">
                                Nenhum incidente selecionado.
                            </div>
                        </td>
                    </tr>
                    }

                </tbody>
            </table>
        </div>
    )

}