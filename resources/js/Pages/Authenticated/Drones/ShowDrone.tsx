import * as React from "react";
import { router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowDrone({ drone }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Equipamentos", "Drones", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Drone
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={drone.data.name}
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
                                    value={drone.data.manufacturer}
                                    id="manufacturer"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="model" text="Modelo" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={drone.data.model}
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
                                    value={drone.data.record_number}
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
                                    value={drone.data.serial_number}
                                    id="serial_number"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="weight" text="Peso" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={drone.data.weight}
                                    id="weight"
                                />
                            </div>
                            {drone.data.image ? (
                                <img
                                    className="h-auto max-w-lg rounded-lg"
                                    width={300}
                                    height={300}
                                    src={drone.data.image}
                                    alt="imagem do drone"
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
                                    router.get(route("drones.index"))
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
