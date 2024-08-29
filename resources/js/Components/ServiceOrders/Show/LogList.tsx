import * as React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { DeleteOrUndeleteResource } from '@/Components/Shared/Modal/DeleteOrUndeleteResource';

export function LogList() {

    const { service_order_id, logs, can, queryParams = null }: any = usePage().props;
    const [selections, setSelections] = React.useState<{ id: string }[]>([]);

    const form = useForm();

    function handleExport(name: string, file_contents: string) {

        const blob = new Blob([file_contents], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = name + '.kml';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    }

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
        const record = logs.data.filter((selection: any) => selection.id === selected_record_id)[0];
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
                    <Link href={route('logs.create', { service_order: service_order_id })}>
                        <button className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                            </svg>
                            <span>Criar</span>
                        </button>
                    </Link>
                    <DeleteOrUndeleteResource
                        can_open={can.edit_log && selections.length > 0}
                        reload={reload}
                        action={"delete"}
                        request_url={window.location.pathname + "/logs/delete-many?ids=" + selections.map((selection) => selection.id).join(',')}
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
                            Nome
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Criado em
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Atualizado em
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                            Exportar
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
                            <td className="text-left px-6 py-4">
                                {log.updated_at}
                            </td>
                            <td className="flex justify-end space-x-2 px-6 py-4">
                                <button onClick={() => handleExport(log.name, log.file)}>
                                    <svg className="w-5 h-5 text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                    </svg>
                                </button>
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
    )

}