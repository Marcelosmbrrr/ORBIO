import * as React from 'react';
import { usePage } from '@inertiajs/react';
import { SelectedLog } from '@/Pages/Authenticated/Reports/CreateReport';

const InputField = ({ id, placeholder }: { id: string, placeholder: string }) => (
    <input
        type="text"
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
    />
);

export function ImagesAndMetereologicalDataStep(props: { logs: SelectedLog[] }) {

    const { serviceorder } = usePage().props;

    return (
        <>
            <div className='mb-5'>
                <h2 className="mb-2 text-md font-bold text-gray-900 dark:text-white">Imagens e Dados Metereológicos</h2>
                <p className="text-gray-500 dark:text-gray-400">Capture a imagem dos logs selecionados e informe os dados metereológicos.</p>
            </div>

            <div className="flex flex-wrap gap-5">
                {props.logs.map((log: SelectedLog, index) => (
                    <div key={log.id} className="max-w-lg rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                        <iframe className="w-full aspect-video" src={window.location.pathname.replace("/reports/create", "/logs/" + log.id)}></iframe>
                        <div className="px-3 py-4">
                            <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">Nome: {log.name}.kml</h3>
                            <div className='flex flex-col gap-4'>
                                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                <div className='grid grid-cols-2 gap-2'>
                                    {['initial_temperature', 'final_temperature', 'initial_humidity', 'final_humidity', 'initial_wind', 'final_wind'].map((idSuffix, i) => (
                                        <InputField
                                            key={i}
                                            id={`${log.id}_${idSuffix}`}
                                            placeholder={idSuffix.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
