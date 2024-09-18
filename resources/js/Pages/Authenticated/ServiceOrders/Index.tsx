import * as React from "react";
import { router, usePage } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";
import { Paginator } from "@/Components/Shared/Table/Paginator";
import { PaginationInfo } from "@/Components/Shared/Table/PaginationInfo";
import { FilterSelector } from "@/Components/Shared/Table/FilterSelector";
import { ShowServiceOrder } from "@/Components/ServiceOrders/ShowServiceOrder";
import { LimitSelector } from "@/Components/Shared/Table/LimitSelector";
import { OrderSelector } from "@/Components/Shared/Table/OrderSelector";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { PlusIcon } from "@/Components/Shared/Icons/PlusIcon";
import { DownloadFileIcon } from "@/Components/Shared/Icons/DownloadFileIcon";
// Types
import { ServiceOrderRecord } from "./types";
// Utils
import { exportDataAsCsv } from "@/Utils/ExportDataAsCsv";

type QueryParams = {
    page: number;
    search: string;
    order_by: string;
    limit: string;
    group: "all" | "open" | "approved" | "finished" | "canceled";
};
const defaultParams: QueryParams = {
    page: 1,
    search: "",
    order_by: "id",
    limit: "10",
    group: "all",
};

const statusClassName: { [key: string]: string } = {
    open: "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2",
    approved: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    canceled: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
    finished: "h-2.5 w-2.5 rounded-full bg-blue-500 mr-2",
};

export default function ServiceOrders() {
    const {
        auth,
        pagination,
        queryParams = null,
        success,
    }: any = usePage().props;

    const serviceOrders: ServiceOrderRecord[] = pagination.data;
    const meta = pagination.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [search, setSearch] = React.useState<string>(currentParams.search);

    const handleNavigation = React.useCallback(
        (params: Partial<QueryParams>) => {
            router.get("service-orders", { ...currentParams, ...params });
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

    function handleExportTableData() {
        exportDataAsCsv("ordens-de-serviço", pagination.data, {
            status: {
                is_object: true,
                get: "title",
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col h-full">
                <Breadcrumb items={["Ordens de Serviço"]} />
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
                                auth.user.authorization.serviceorders.create
                            }
                            reload={handleNavigation}
                            currentParams={currentParams}
                            handleExportTableData={handleExportTableData}
                        />
                    </div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <FilterSelector
                        currentGroup={currentParams.group}
                        onChange={(
                            group:
                                | "all"
                                | "open"
                                | "approved"
                                | "finished"
                                | "canceled"
                        ) => handleNavigation({ group, page: 1 })}
                        options={[
                            "all",
                            "open",
                            "approved",
                            "finished",
                            "canceled",
                        ]}
                        labels={{
                            all: "Todas",
                            open: "Abertas",
                            approved: "Em antendimento",
                            finished: "Finalizadas",
                            canceled: "Canceladas",
                        }}
                    />
                    <ServiceOrderTable serviceOrders={serviceOrders} />
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
                onClick={() => router.get(route("service-orders.create"))}
                processing={false}
            />
        )}
        <LimitSelector
            value={currentParams.limit}
            changeLimit={(limit: string) => reload({ limit })}
        />
        <OrderSelector
            value={currentParams.order_by}
            options={[
                { id: "id", name: "criação" },
                { id: "name", name: "nome" },
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

const ServiceOrderTable = ({ serviceOrders }: any) => (
    <div className="mt-2 overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-md text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="text-left px-6 py-3">
                        Status
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Nome
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Atendente
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Piloto / Cliente
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Criado em
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Atualizado em
                    </th>
                    <th scope="col" className="text-right px-6 py-3">
                        Visualizar
                    </th>
                </tr>
            </thead>
            <tbody>
                {serviceOrders.length > 0 ? (
                    serviceOrders.map((order: ServiceOrderRecord) => (
                        <tr
                            key={order.id}
                            className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center text-gray-900 dark:text-white">
                                    <div
                                        className={
                                            statusClassName[order.situation.key]
                                        }
                                    ></div>{" "}
                                    {order.situation.name}
                                </div>
                            </td>
                            <td className="text-left px-6 py-4">
                                {order.name}
                            </td>
                            <td className="text-left px-6 py-4">
                                {order.attendant ? order.attendant : "----"}
                            </td>
                            <td className="flex flex-col space-y-2 px-6 py-4">
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2 text-green-600"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 14 18"
                                    >
                                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span>{order.pilot ?? "Sem Piloto"}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2 text-green-600"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 14 18"
                                    >
                                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span>{order.client ?? "Sem Cliente"}</span>
                                </div>
                            </td>
                            <td className="text-left px-6 py-4">
                                {order.created_at}
                            </td>
                            <td className="text-left px-6 py-4">
                                {order.updated_at}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end items-center h-full">
                                    <ShowServiceOrder id={order.id} />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td
                            colSpan={9}
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
