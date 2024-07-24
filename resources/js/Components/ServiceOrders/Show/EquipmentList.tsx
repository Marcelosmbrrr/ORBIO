import * as React from 'react';
import { usePage, Link } from '@inertiajs/react';

export function EquipmentList() {

    const { equipments, queryParams = null }: any = usePage().props;

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="text-left px-6 py-3">
                            Nome
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Fabricante
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Modelo
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Número de Registro
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Número Serial
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                            Peso
                        </th>
                        <td scope="col" className="text-right px-6 py-3">
                            Visualizar
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {equipments.data.length > 0 && equipments.data.map((equipment: any) =>
                        <tr key={equipment.id} className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td className="text-left px-6 py-4">
                                {equipment.name}
                            </td>
                            <td className="text-left px-6 py-4">
                                {equipment.manufacturer}
                            </td>
                            <td className="text-left px-6 py-4">
                                {equipment.model}
                            </td>
                            <td className="text-left px-6 py-4">
                                {equipment.record_number}
                            </td>
                            <td className="text-left px-6 py-4">
                                {equipment.serial_number}
                            </td>
                            <td className="text-left px-6 py-4">
                                {equipment.weight}
                            </td>
                            <td className="flex justify-end space-x-2 px-6 py-4">
                                <Link href={"/equipments/" + equipment.id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-5 h-5 text-green-600 transition duration-75">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
                                    </svg>
                                </Link>
                            </td>
                        </tr>
                    )}

                    {equipments.data.length === 0 && <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap dark:text-white">
                            <div className="flex items-center justify-center">
                                Nenhum equipmento selecionado.
                            </div>
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    )

}