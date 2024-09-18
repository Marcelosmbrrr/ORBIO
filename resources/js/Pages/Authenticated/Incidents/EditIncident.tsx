import * as React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { usePage, useForm, router } from "@inertiajs/react";
// Custom
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { InputError } from "@/Components/Shared/Input/InputError";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function EditIncident() {
    const { service_order_id, incident }: any = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        type: incident.type,
        description: incident.description,
        date: incident.date,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        patch(
            route("incidents.update", {
                service_order: service_order_id,
                incident: incident.id,
            })
        );
    };

    return (
        <AuthenticatedLayout>
            <Breadcrumb
                items={[
                    "Ordens de Serviço",
                    "Visualizar",
                    "Incidentes",
                    "Editar",
                ]}
            />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Editar Incidente
                    </h2>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="type" text="Tipo" />
                                <InertiaInput
                                    type="text"
                                    value={data.type}
                                    name="type"
                                    onChange={setData}
                                    id="type"
                                    placeholder="Informe o tipo"
                                />
                                <InputError text={errors.type} />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="description"
                                    text="Descrição"
                                />
                                <InertiaInput
                                    type="text"
                                    value={data.description}
                                    name="description"
                                    onChange={setData}
                                    id="description"
                                    placeholder="Informe a descrição"
                                />
                                <InputError text={errors.description} />
                            </div>
                            <div className="w-fit">
                                <label
                                    htmlFor="date"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Data
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    id="date"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                />
                                <span className="text-red-500 text-sm">
                                    {errors.date}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-1 py-3">
                            <Button
                                type="button"
                                text="Voltar"
                                onClick={() =>
                                    router.get(
                                        route(
                                            "service-orders.show",
                                            service_order_id
                                        )
                                    )
                                }
                            />
                            <Button
                                processing={processing}
                                type="submit"
                                text="Confirmar"
                            />
                        </div>
                    </form>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
