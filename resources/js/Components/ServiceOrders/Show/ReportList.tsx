import * as React from 'react';
import { Link, usePage } from '@inertiajs/react';

export function ReportList() {

    const { service_order_id, reports, can, queryParams = null }: any = usePage().props;

    function handleExport(file: string) {
        console.log(file)
    }

    return (
        <div className="relative overflow-x-auto space-y-3">

            {can.edit_report &&
                <Link href={route('reports.create', { service_order: service_order_id })}>
                    <button className="flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
                        </svg>
                        <span>Criar</span>
                    </button>
                </Link>
            }

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="text-left px-6 py-3">
                            Nome
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Criado em
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Atualizado em
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Visualizar | Exportar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {reports.data.length > 0 && reports.data.map((report: any) =>
                        <tr key={report.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td className="text-left px-6 py-4">
                                {report.name}
                            </td>
                            <td className="text-left px-6 py-4">
                                {report.created_at}
                            </td>
                            <td className="text-left px-6 py-4">
                                {report.updated_at}
                            </td>
                            <td className="text-left px-6 py-4">
                                <Link href={route('reports.show', { service_order: service_order_id, report: report.id })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-5 h-5 text-green-600 transition duration-75">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
                                    </svg>
                                </Link>
                                <button onClick={() => handleExport(report.file)}>
                                    <svg className="flex-shrink-0 w-5 h-5 text-green-600 transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    )}

                    {reports.data.length === 0 && <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">
                                Nenhum relatório registrado.
                            </div>
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    )

}