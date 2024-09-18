import * as React from "react";
import { Link } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/Shared/Input/Input";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { InputError } from "@/Components/Shared/Input/InputError";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowPilot({ pilot }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Usúarios", "Pilotos", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Piloto
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={pilot.data.name}
                                    id="name"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="email" text="E-mail" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={pilot.data.email}
                                    id="email"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="status" text="Status" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={pilot.data.status.title}
                                    id="status"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="role" text="Cargo" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={pilot.data.role}
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
                                    value={pilot.data.created_at}
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
                                    value={pilot.data.updated_at}
                                    id="updated_at"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end py-3">
                            <Link
                                href={route("pilots.index")}
                                className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                                Voltar
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
