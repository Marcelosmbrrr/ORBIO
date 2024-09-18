import * as React from "react";
import { useForm, router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { InputError } from "@/Components/Shared/Input/InputError";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";
import { FileInput } from "@/Components/Shared/Input/FileInput";

export default function EditBattery({ battery }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        name: battery.data.name,
        manufacturer: battery.data.manufacturer,
        model: battery.data.model,
        serial_number: battery.data.serial_number,
        last_charge: battery.data.last_charge,
        image: battery.data.image_url,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/batteries/" + battery.data.id);
    };

    function onChangeImage(e: any) {
        const uploaded_file = e.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith("image/")) {
            const imgURL = URL.createObjectURL(uploaded_file);
            setData("image", uploaded_file);
        }
    }

    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Equipamentos", "Baterias", "Editar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Editar Bateria
                    </h2>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="name" text="Nome" />
                                <InertiaInput
                                    type="text"
                                    value={data.name}
                                    name="name"
                                    onChange={setData}
                                    id="name"
                                    placeholder="Informe o nome completo"
                                />
                                <InputError text={errors.name} />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="manufacturer"
                                    text="Fabricante"
                                />
                                <InertiaInput
                                    type="text"
                                    value={data.manufacturer}
                                    name="manufacturer"
                                    onChange={setData}
                                    id="manufacturer"
                                    placeholder="Informe o fabricante"
                                />
                                <InputError text={errors.manufacturer} />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="model" text="Modelo" />
                                <InertiaInput
                                    type="text"
                                    value={data.model}
                                    name="model"
                                    onChange={setData}
                                    id="model"
                                    placeholder="Informe o modelo"
                                />
                                <InputError text={errors.model} />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="serial_number"
                                    text="Número Serial"
                                />
                                <InertiaInput
                                    type="text"
                                    value={data.serial_number}
                                    name="serial_number"
                                    onChange={setData}
                                    id="serial_number"
                                    placeholder="Informe o número serial"
                                />
                                <InputError text={errors.serial_number} />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="last_charge"
                                    text="Última Carga"
                                />
                                <input
                                    type="date"
                                    value={data.last_charge}
                                    onChange={(e) =>
                                        setData("last_charge", e.target.value)
                                    }
                                    id="email"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                />
                                <InputError text={errors.last_charge} />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="image"
                                    text="Imagem (jpg,jpeg)"
                                />
                                <FileInput
                                    onChange={onChangeImage}
                                    accept={[".jpg", ".jpeg"]}
                                    id="image"
                                />
                                <InputError text={errors.image} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-1 py-3">
                            <Button
                                type="button"
                                text="Voltar"
                                onClick={() =>
                                    router.get(route("batteries.index"))
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
