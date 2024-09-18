import * as React from "react";
import { Link, router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowManager({ manager }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Gerentes", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Gerente
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.name}
                                    id="name"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="email" text="E-mail" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.email}
                                    id="email"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="status" text="Status" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.status.title}
                                    id="status"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="role" text="Cargo" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.role}
                                    id="role"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="created_at"
                                    text="Criado em"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.created_at}
                                    id="email"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="updated_at"
                                    text="Atualizado em"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={manager.data.updated_at}
                                    id="updated_at"
                                />
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
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
