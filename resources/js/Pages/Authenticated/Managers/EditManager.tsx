import * as React from "react";
import { useForm, Link, router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { InputError } from "@/Components/Shared/Input/InputError";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function EditTenant({ manager }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        name: manager.data.name,
        email: manager.data.email,
        password: "",
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/managers/" + manager.data.id);
    };

    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Gerentes", "Editar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Editar Gerente
                    </h2>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
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
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="email"
                                    text="E-mail"
                                    hint="O usuário terá que confirmar o e-mail novamente."
                                />
                                <InertiaInput
                                    type="text"
                                    value={data.email}
                                    name="email"
                                    onChange={setData}
                                    id="email"
                                    placeholder="Informe o email"
                                />
                                <InputError text={errors.email} />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="password"
                                    text="Senha (opcional)"
                                />
                                <InertiaInput
                                    type="password"
                                    value={data.password}
                                    name="password"
                                    onChange={setData}
                                    id="password"
                                    placeholder="Informe a senha"
                                />
                                <InputError text={errors.password} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-1 mt-3">
                            <Button
                                type="button"
                                text="Voltar"
                                onClick={() =>
                                    router.get(route("managers.index"))
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
