import * as React from "react";
import { router, usePage } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";
import { Paginator } from "@/Components/Shared/Pagination/Paginator";
import { PaginationInfo } from "@/Components/Shared/Pagination/PaginationInfo";
import { FilterSelector } from "@/Components/Shared/Pagination/FilterSelector";
import { DeleteOrUndeleteResource } from "@/Components/Shared/Modal/DeleteOrUndeleteResource";
import { LimitSelector } from "@/Components/Shared/Pagination/LimitSelector";
import { OrderSelector } from "@/Components/Shared/Pagination/OrderSelector";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { PlusIcon } from "@/Components/Shared/Icons/PlusIcon";
import { IconButton } from "@/Components/Shared/Buttons/IconButton";
import { PenIcon } from "@/Components/Shared/Icons/PenIcon";
import { EyeIcon } from "@/Components/Shared/Icons/EyeIcon";
// Types
import { PilotSelected, PilotRecord, Meta } from "./types";
import { Input } from "@/Components/Shared/Input/Input";

type QueryParams = {
    page: number;
    search: string;
    order_by: string;
    limit: string;
    group: "all" | "verified" | "unverified" | "deleted";
};

const statusClassname: { [key: string]: string } = {
    verified: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    unverified: "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
};

const defaultParams: QueryParams = {
    page: 1,
    search: "",
    order_by: "id",
    limit: "10",
    group: "all",
};

export default function Pilots() {
    const {
        auth,
        pagination,
        queryParams = null,
        success,
    }: any = usePage().props;

    const pilots: PilotRecord[] = pagination.data;
    const meta: Meta = pagination.meta;
    const currentParams: QueryParams = { ...defaultParams, ...queryParams };

    const [selections, setSelections] = React.useState<PilotSelected[]>([]);
    const [search, setSearch] = React.useState<string>(currentParams.search);

    const handleNavigation = React.useCallback(
        (params: Partial<QueryParams>) => {
            setSelections([]);
            router.get("pilots", { ...currentParams, ...params });
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
                const pilot = pilots.find((pilot) => pilot.id === recordId);
                if (pilot) {
                    const newSelection: PilotSelected = {
                        id: pilot.id,
                        is_deleted: Boolean(pilot.deleted_at),
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
        auth.user.authorization.users.write &&
        selections.every((sel) => sel.is_deleted === selections[0].is_deleted);

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col h-full">
                <Breadcrumb items={["Usuários", "Pilotos"]} />
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
                                auth.user.authorization.users.write
                            }
                            canEdit={
                                selections.length === 1 &&
                                auth.user.authorization.users.write
                            }
                            canShow={
                                selections.length === 1 &&
                                auth.user.authorization.users.write
                            }
                            canDeleteOrUndelete={canOpenDeleteOrUndelete}
                            selections={selections}
                            reload={handleNavigation}
                            currentParams={currentParams}
                        />
                    </div>
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <FilterSelector
                        currentGroup={currentParams.group}
                        onChange={(
                            group: "all" | "verified" | "unverified" | "deleted"
                        ) => handleNavigation({ group, page: 1 })}
                        options={["all", "verified", "unverified", "deleted"]}
                        labels={{
                            all: "Todos",
                            verified: "Verificados",
                            unverified: "Não Verificados",
                            deleted: "Deletados",
                        }}
                    />
                    <PilotTable
                        pilots={pilots}
                        isSelected={isSelected}
                        toggleSelection={toggleSelection}
                        canEdit={auth.user.authorization.users.write}
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
}: any) => (
    <div className="flex justify-start md:justify-end flex-shrink-0 w-full md:w-auto md:flex-row md:space-y-0 md:items-center space-x-1">
        {canCreate && (
            <Button
                type="button"
                text="Criar"
                icon={PlusIcon}
                onClick={() => router.get(route("pilots.create"))}
                processing={false}
            />
        )}
        <DeleteOrUndeleteResource
            can_open={canDeleteOrUndelete}
            reload={reload}
            action={
                currentParams.group === "deleted" ||
                selections.every((sel: PilotSelected) => sel.is_deleted)
                    ? "undelete"
                    : "delete"
            }
            request_url={
                currentParams.group === "deleted" ||
                selections.every((sel: PilotSelected) => sel.is_deleted)
                    ? `/actions/undelete/users?ids=${selections
                          .map((selection: any) => selection.id)
                          .join(",")}`
                    : `/pilots/delete-many?ids=${selections
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
                { id: "email", name: "email" },
            ]}
            changeOrderBy={(order_by: string) => reload({ order_by })}
        />
    </div>
);

const PilotTable = ({ pilots, isSelected, toggleSelection, canEdit }: any) => (
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
                        Nome
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Email
                    </th>
                    <th scope="col" className="text-left px-6 py-3">
                        Status
                    </th>
                    <th scope="col" className="text-right px-6 py-3">
                        Editar / Visualizar
                    </th>
                </tr>
            </thead>
            <tbody>
                {pilots.length > 0 ? (
                    pilots.map((pilot: PilotRecord) => (
                        <tr
                            key={pilot.id}
                            className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50"
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                                <div className="flex items-center">
                                    <input
                                        checked={isSelected(pilot.id)}
                                        onChange={() =>
                                            toggleSelection(pilot.id)
                                        }
                                        value={pilot.id}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </th>
                            <td className="text-left px-6 py-4">
                                {pilot.name}
                            </td>
                            <td className="text-left px-6 py-4">
                                {pilot.email}
                            </td>
                            <td className="text-left px-6 py-4">
                                <div className="flex items-center text-gray-900 dark:text-white">
                                    <div
                                        className={
                                            statusClassname[
                                                pilot.status.style_key
                                            ]
                                        }
                                    ></div>{" "}
                                    {pilot.status.title}
                                </div>
                            </td>
                            <td className="flex justify-end gap-x-2 text-left px-6 py-4">
                                <IconButton
                                    icon={PenIcon}
                                    onClick={() =>
                                        router.get(
                                            route("pilots.edit", pilot.id)
                                        )
                                    }
                                />
                                <IconButton
                                    icon={EyeIcon}
                                    onClick={() =>
                                        router.get(
                                            route("pilots.show", pilot.id)
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td
                            colSpan={5}
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
