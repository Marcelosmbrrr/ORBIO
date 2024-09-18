import * as React from "react";
import { router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { InputLabel } from "@/Components/Shared/Label/InputLabel";
import { Input } from "@/Components/Shared/Input/Input";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ShowFlightPlan({ flightplan }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Planos de Voo", "Visualizar"]} />
            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Plano de Voo
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="name" text="Nome" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={flightplan.data.name}
                                    id="name"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <InputLabel
                                    htmlFor="localization"
                                    text="Localização"
                                />
                                <Input
                                    readOnly
                                    type="text"
                                    value={
                                        flightplan.data.state +
                                        " , " +
                                        flightplan.data.city
                                    }
                                    id="localization"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="status" text="Status" />
                                <Input
                                    readOnly
                                    type="text"
                                    value={flightplan.data.status.title}
                                    id="status"
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
                                    value={flightplan.data.created_at}
                                    id="created_at"
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
                                    value={flightplan.data.updated_at}
                                    id="updated_at"
                                />
                            </div>
                        </div>
                        <iframe
                            className="max-w-3xl mx-auto aspect-video mt-5"
                            src={
                                window.location.origin +
                                "/flight-plans/" +
                                flightplan.data.id +
                                "?visualization=true"
                            }
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                        <div className="flex justify-end py-3">
                            <Button
                                type="button"
                                text="Voltar"
                                onClick={() =>
                                    router.get(route("flight-plans.index"))
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
