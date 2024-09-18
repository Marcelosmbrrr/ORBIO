import * as React from "react";
import { router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowBattery({ battery }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Equipamentos", "Baterias", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Bateria
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={battery.data.name}
                                    id="name"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="manufacturer"
                                    text="Fabricante"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={battery.data.manufacturer}
                                    id="manufacturer"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="model" text="Modelo" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={battery.data.model}
                                    id="model"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="serial_number"
                                    text="Número Serial"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={battery.data.serial_number}
                                    id="serial_number"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="last_charge"
                                    text="Última Carga"
                                />
                                <input
                                    type="text"
                                    readOnly
                                    value={battery.data.last_charge}
                                    id="last_charge"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            {battery.data.image ? (
                                <img
                                    className="h-auto max-w-lg rounded-lg"
                                    width={300}
                                    height={300}
                                    src={battery.data.image}
                                    alt="imagem da bateria"
                                />
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="flex justify-end py-3">
                            <Button
                                type="button"
                                text="Voltar"
                                onClick={() =>
                                    router.get(route("batteries.index"))
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
