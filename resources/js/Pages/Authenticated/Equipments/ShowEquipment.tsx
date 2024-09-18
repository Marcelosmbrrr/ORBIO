import * as React from "react";
import { router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowEquipment({ equipment }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Equipamentos", "Outros", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Equipamento
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={equipment.data.name}
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
                                    value={equipment.data.manufacturer}
                                    id="manufacturer"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="model" text="Modelo" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={equipment.data.model}
                                    id="model"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="record_number"
                                    text="Número de Registro"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={equipment.data.record_number}
                                    id="record_number"
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
                                    value={equipment.data.serial_number}
                                    id="serial_number"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="weight" text="Peso" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={equipment.data.weight}
                                    id="weight"
                                />
                            </div>
                            {equipment.data.image ? (
                                <img
                                    className="h-auto max-w-lg rounded-lg"
                                    width={300}
                                    height={300}
                                    src={equipment.data.image}
                                    alt="imagem do equipamento"
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
                                    router.get(route("equipments.index"))
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
