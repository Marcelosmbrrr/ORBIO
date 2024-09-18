import * as React from "react";
import { router, usePage } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/Shared/Buttons/Button";
import { Paginator } from "@/Components/Shared/Table/Paginator";
import { PaginationInfo } from "@/Components/Shared/Table/PaginationInfo";
import { FilterSelector } from "@/Components/Shared/Table/FilterSelector";
import { DeleteOrUndeleteResource } from "@/Components/Shared/Modal/DeleteOrUndeleteResource";
import { LimitSelector } from "@/Components/Shared/Table/LimitSelector";
import { OrderSelector } from "@/Components/Shared/Table/OrderSelector";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Input } from "@/Components/Shared/Input/Input";
import { PlusIcon } from "@/Components/Shared/Icons/PlusIcon";
import { IconButton } from "@/Components/Shared/Buttons/IconButton";
import { PenIcon } from "@/Components/Shared/Icons/PenIcon";
import { EyeIcon } from "@/Components/Shared/Icons/EyeIcon";
import { DownloadFileIcon } from "@/Components/Shared/Icons/DownloadFileIcon";
// Types
import { BatterySelected, BatteryRecord } from "./types";
// Utils
import { exportDataAsCsv } from "@/Utils/ExportDataAsCsv";

type QueryParams = {
    page: number;
    search: string;
    order_by: string;
    limit: string;
    group: "all" | "active" | "deleted";
};
const defaultParams: QueryParams = {
    page: 1,
    search: "",
    order_by: "id",
    limit: "10",
    group: "all",
};

const statusClassname: { [key: string]: string } = {
    active: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
};

export default function Batteries() {
    const {
        auth,
        pagination,
        queryParams = null,
        success,
    }: any = usePage().props;

    const batteries: BatteryRecord[] = pagination.data;
    const meta = pagination.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] = React.useState<BatterySelected[]>([]);
    const [search, setSearch] = React.useState<string>(currentParams.search);

    const handleNavigation = React.useCallback(
        (params: Partial<QueryParams>) => {
            setSelections([]);
            router.get("batteries", { ...currentParams, ...params });
        },
        [currentParams]
    );

    const handleSearchSubmit = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                handleNavigation({ search });
            }
        },
        [search]
    );

    const toggleSelection = (recordId: string) => {
        setSelections((prev) => {
            const exists = prev.some((selection) => selection.id === recordId);
            if (exists) {
                return prev.filter((selection) => selection.id !== recordId);
            } else {
                const battery = batteries.find(
                    (battery) => battery.id === recordId
                );
                if (battery) {
                    const newSelection: BatterySelected = {
                        id: battery.id,
                        is_deleted: Boolean(battery.deleted_at),
                    };
                    return [...prev, newSelection];
                }
                return prev;
            }
        });
    };

    const isSelected = (recordId: string) =>
        selections.some((selection) => selection.id === recordId);

    const canOpenDeleteOrUndelete =
        selections.length > 0 &&
        auth.user.authorization.equipments.write &&
        selections.every((sel) => sel.is_deleted === selections[0].is_deleted);

    function handleExportTableData() {
        exportDataAsCsv("baterias", pagination.data, {
            status: {
                is_object: true,
                get: "title",
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col h-full">
                <Breadcrumb items={["Equipamentos", "Baterias"]} />
                <div className="grow py-5 rounded">
                    <div className="max-w-md">
                        {success && <Alert type="success" message={success} />}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <div className="w-full md:w-1/2">
                            <Input
                                type={"search"}
                                value={search}
                                onChange={setSearch}
                                onKeyDown={handleSearchSubmit}
                                id={"search-manager"}
                                name={"search"}
                                placeholder={"Pesquisar"}
                            />
                        </div>
                        <ActionButtons
                            canCreate={
                                selections.length === 0 &&
                                auth.user.authorization.equipments.write
                            }
                            canDeleteOrUndelete={canOpenDeleteOrUndelete}
                            selections={selections}
                            reload={handleNavigation}
                            currentParams={currentParams}
                            handleExportTableData={handleExportTableData}
                        />
                    </div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <FilterSelector
                        currentGroup={currentParams.group}
                        onChange={(group: "all" | "active" | "deleted") =>
                            handleNavigation({ group, page: 1 })
                        }
                        options={["all", "active", "deleted"]}
                        labels={{
                            all: "Todos",
                            active: "Ativos",
                            deleted: "Deletados",
                        }}
                    />
                    <BatteryTable
                        batteries={batteries}
                        isSelected={isSelected}
                        toggleSelection={toggleSelection}
                        canEdit={auth.user.authorization.equipments.write}
                    />
                    <PaginationInfo meta={meta} />
                    <Paginator
                        current_page={meta.current_page}
                        pages={meta.last_page}
                        changePage={(page: number) =>
                            handleNavigation({ page })
                        }
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const ActionButtons = ({
    canCreate,
    canDeleteOrUndelete,
    selections,
    reload,
    currentParams,
    handleExportTableData,
}: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        {canCreate && (
            <Button
                type="button"
                text="Criar"
                icon={PlusIcon}
                onClick={() => router.get(route("batteries.create"))}
                processing={false}
            />
        )}
        <DeleteOrUndeleteResource
            can_open={canDeleteOrUndelete}
            reload={reload}
            action={
                currentParams.group === "deleted" ||
                selections.every((sel: BatterySelected) => sel.is_deleted)
                    ? "undelete"
                    : "delete"
            }
            request_url={
                currentParams.group === "deleted" ||
                selections.every((sel: BatterySelected) => sel.is_deleted)
                    ? `/actions/undelete/batteries?ids=${selections
                          .map((selection: any) => selection.id)
                          .join(",")}`
                    : `/batteries/delete-many?ids=${selections
                          .map((selection: any) => selection.id)
                          .join(",")}`
            }
        />
        <LimitSelector
            value={currentParams.limit}
            changeLimit={(limit: string) => reload({ limit })}
        />
        <OrderSelector
            value={currentParams.order_by}
            options={[
                { id: "id", name: "criação" },
                { id: "name", name: "nome" },
                { id: "manufacturer", name: "fabricante" },
                { id: "last_charge", name: "última carga" },
            ]}
            changeOrderBy={(order_by: string) => reload({ order_by })}
        />
        <Button
            type="button"
            text="Exportar"
            icon={DownloadFileIcon}
            onClick={() => handleExportTableData()}
            processing={false}
        />
    </div>
);

const BatteryTable = ({
    batteries,
    isSelected,
    toggleSelection,
    canEdit,
}: any) => (
    <div className="mt-2 overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-md text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                            <input
                                disabled
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
                        Serial
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Última Carga
                    </th>
                    <th scope="col" className="text-right px-6 py-3">
                        Editar / Visualizar
                    </th>
                </tr>
            </thead>
            <tbody>
                {batteries.length > 0 ? (
                    batteries.map((battery: BatteryRecord) => (
                        <tr
                            key={battery.id}
                            className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50"
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                                <div className="flex items-center">
                                    <input
                                        checked={isSelected(battery.id)}
                                        onChange={() =>
                                            toggleSelection(battery.id)
                                        }
                                        value={battery.id}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </th>
                            <td className="px-6 py-4">
                                <div className="flex items-center text-gray-900 dark:text-white">
                                    <div
                                        className={
                                            statusClassname[
                                                battery.status.style_key
                                            ]
                                        }
                                    ></div>{" "}
                                    {battery.status.title}
                                </div>
                            </td>
                            <td className="text-left px-6 py-4">
                                {battery.name}
                            </td>
                            <td className="text-left px-6 py-4">
                                {battery.manufacturer}
                            </td>
                            <td className="text-left px-6 py-4">
                                {battery.model}
                            </td>
                            <td className="text-left px-6 py-4">
                                {battery.serial_number}
                            </td>
                            <td className="text-left px-6 py-4">
                                {battery.last_charge}
                            </td>
                            <td className="flex justify-end gap-x-2 text-left px-6 py-4">
                                <IconButton
                                    icon={PenIcon}
                                    onClick={() =>
                                        router.get(
                                            route(
                                                "batteries.edit",
                                                batteries.id
                                            )
                                        )
                                    }
                                />
                                <IconButton
                                    icon={EyeIcon}
                                    onClick={() =>
                                        router.get(
                                            route(
                                                "batteries.show",
                                                batteries.id
                                            )
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))
                ) : (
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
            </tbody>
        </table>
    </div>
);
