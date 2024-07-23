import * as React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { logValidation } from '@/Utils/LogValidation';

interface Props {
    service_order_id: string;
}

type ProcessingLog = { file: File, filename: string, extension: string, size: string, validation: { result: boolean, key: "valid" | "invalid", message: string } };

const validationClassName = {
    valid: "flex w-2.5 h-2.5 bg-green-600 rounded-full me-1.5 flex-shrink-0",
    invalid: "flex w-2.5 h-2.5 bg-red-600 rounded-full me-1.5 flex-shrink-0"
};

export default function CreateLog(props: Props) {

    const [logs, setLogs] = React.useState<ProcessingLog[]>([]);

    const { post, setData, processing } = useForm({
        logs: [] as File[]
    });

    function submit() {
        const url = window.location.pathname.replace("/create", "");
        post(url);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const newLogsPromises = files.map(async (file) => {
            const { verified_file, result, key, message } = await logValidation(file);

            if (verified_file) {
                const { name, size } = verified_file;
                const extension = name.split('.').pop() || '';

                return {
                    file: verified_file,
                    filename: name,
                    extension,
                    size: `${(size / 1024).toFixed(2)} KB`,
                    validation: { result, key, message },
                };
            }

            return null;
        });

        const newLogs = (await Promise.all(newLogsPromises)).filter(log => log !== null) as ProcessingLog[];
        setLogs(newLogs);
        setData('logs', newLogs.map((log) => log.file));
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
                        Ordens de Serviço
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Logs
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
                <div className="mx-auto py-16">
                    <div className='mb-5'>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Criar Log</h2>
                    </div>

                    <div>
                        <div className='mb-5'>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Clique no botão abaixo para abrir o procurador de arquivos do seu computador e selecionar arquivos de log. Ao seleciona-los, serão listados abaixo e também verificados. Os que forem inválidos não serão salvos.
                                </p>
                            </div>
                            <div className='mt-5 flex justify-between items-center'>
                                <div>
                                    <input onChange={handleUpload} type="file" id="file-input" className="hidden" accept='.tlog.kmz,.kml' multiple />
                                    <label htmlFor="file-input" className='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 cursor-pointer'>
                                        Procurar no Computador
                                    </label>
                                </div>
                                <div>
                                    <Link href={route('service-orders.show', { id: props.service_order_id })}>
                                        <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Voltar
                                        </button>
                                    </Link>
                                    <button disabled={processing} onClick={submit} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                        {processing ? "Carregando..." : "Confirmar"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 overflow-x-auto sm:rounded-lg">
                            <div className='my-2'>
                                <p className="text-gray-500 dark:text-gray-400">Arquivos: {logs.length}</p>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="text-left px-6 py-3">
                                            Nome
                                        </th>
                                        <th scope="col" className="text-left px-6 py-3">
                                            Tamanho
                                        </th>
                                        <th scope="col" className="text-left px-6 py-3">
                                            Extensão
                                        </th>
                                        <th scope="col" className="text-right px-6 py-3">
                                            Verificação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr key={log.filename} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50">
                                                <td className="text-left px-6 py-4">{log.filename}</td>
                                                <td className="text-left px-6 py-4">{log.size}</td>
                                                <td className="text-left px-6 py-4">{log.extension}</td>
                                                <td className="flex justify-end px-6 py-4">
                                                    <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
                                                        <span className={validationClassName[log.validation.key]}></span>
                                                        {log.validation.message}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                            <td colSpan={6} className="px-6 py-4 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center justify-center">Nenhum log selecionado.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
