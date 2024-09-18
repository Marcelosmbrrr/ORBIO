import * as React from "react";
import { router, usePage } from "@inertiajs/react";
// Custom
import { Input } from "@/Components/Shared/Input/Input";
import { Button } from "@/Components/Shared/Buttons/Button";
import { PlusIcon } from "@/Components/Shared/Icons/PlusIcon";
import { LimitSelector } from "@/Components/Shared/Table/LimitSelector";
import { Paginator } from "@/Components/Shared/Table/Paginator";
import { PaginationInfo } from "@/Components/Shared/Table/PaginationInfo";
import { FilterSelector } from "@/Components/Shared/Table/FilterSelector";

type QueryParams = {
    page: number;
    search: string;
    order_by: string;
    limit: string;
    group: "all" | "verified" | "unverified";
};

const statusClassname: { [key: string]: string } = {
    active: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
};

const defaultParams: QueryParams = {
    page: 1,
    search: "",
    order_by: "id",
    limit: "10",
    group: "all",
};

export const EquipmentStep: React.FC<{
    selection: { id: string }[];
    setData: Function;
}> = ({ selection, setData }) => {
    const { equipments, queryParams = null } = usePage().props as any;
    const data = equipments.data;
    const meta = equipments.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] =
        React.useState<{ id: string }[]>(selection);
    const [processing, setProcessing] = React.useState(false);
    const [search, setSearch] = React.useState<string>("");

    const fetchData = React.useCallback(
        (params: Partial<QueryParams>) => {
            setProcessing(true);
            const newParams = { ...currentParams, ...params };
            router.visit("/service-orders/create", {
                only: ["equipments"],
                data: newParams,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
            });
        },
        [currentParams]
    );

    const handleSearchSubmit = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                fetchData({ search });
            }
        },
        [search]
    );

    const onSelect = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedRecordId = e.target.value;
            const clone = [...selections];
            const recordIndex = clone.findIndex(
                (selection) => selection.id === selectedRecordId
            );

            if (recordIndex !== -1) {
                clone.splice(recordIndex, 1);
            } else {
                const record = data.find(
                    (equipment: any) => equipment.id === selectedRecordId
                );
                if (record) {
                    clone.push({ id: record.id });
                }
            }

            setSelections(clone);
            setData("equipments", clone);
        },
        [selections, data]
    );

    const isRowSelected = React.useCallback(
        (record_id: string): boolean => {
            return selections.some((selection) => selection.id === record_id);
        },
        [selections]
    );

    return (
        <>
            <div className="mb-5">
                <h2 className="mb-4 text-md font-bold text-gray-900 dark:text-white">
                    Equipamento (opcional)
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Seleções: {selections.length}
                </p>
            </div>

            <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2">
                    <Input
                        type={"search"}
                        value={search}
                        onChange={setSearch}
                        onKeyDown={handleSearchSubmit}
                        id={"search"}
                        name={"search"}
                        placeholder={"Pesquisar"}
                    />
                </div>
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
            <Paginator
                current_page={meta.current_page}
                pages={meta.last_page}
                changePage={(page: number) => fetchData({ page })}
            />
        </>
    );
};

const EquipmentsTable = ({
    data,
    processing,
    onSelect,
    isRowSelected,
}: any) => (
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
                    <th scope="col" className="text-left px-6 py-3">
                        Status
                    </th>
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
                </tr>
            </thead>
            <tbody>
                {!processing &&
                    data.length > 0 &&
                    data.map((equipment: any) => (
                        <tr
                            key={equipment.id}
                            className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50"
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
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
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                                <div className="flex items-center text-gray-900 dark:text-white">
                                    <div
                                        className={
                                            statusClassname[
                                                equipment.status.style_key
                                            ]
                                        }
                                    ></div>{" "}
                                    {equipment.status.title}
                                </div>
                            </th>
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
                        </tr>
                    ))}

                {!processing && data.length === 0 && (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td
                            colSpan={8}
                            className="px-6 py-4 whitespace-nowrap dark:text-white"
                        >
                            <div className="flex items-center justify-center">
                                Nenhum registro encontrado.
                            </div>
                        </td>
                    </tr>
                )}

                {processing && (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td
                            colSpan={8}
                            className="px-6 py-4 whitespace-nowrap dark:text-white"
                        >
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

const ActionButtons = ({ reload, currentParams }: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        <Button
            type="button"
            text="Criar"
            icon={PlusIcon}
            onClick={() => router.get(route("equipments.create"))}
            processing={false}
        />
        <LimitSelector
            value={currentParams.limit}
            changeLimit={(limit: string) => reload({ limit })}
        />
    </div>
);
