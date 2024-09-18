import React from "react";
import { router } from "@inertiajs/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
// Custom
import { Button } from "@/Components/Shared/Buttons/Button";

interface ConfirmationStepProps {
    form: any;
    submit: (e: React.FormEvent) => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    form,
    submit,
}) => {
    const renderStatus = (status: boolean) =>
        status ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
            <XCircleIcon className="h-5 w-5 text-red-500" />
        );

    return (
        <>
            <div className="mb-3">
                <h2 className="text-md font-bold text-gray-900 dark:text-white">
                    Confirmação dos Dados
                </h2>
            </div>
            <form
                className="bg-gray-50 antialiased dark:bg-gray-900"
                onSubmit={submit}
            >
                <div className="mx-auto">
                    <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                        A ordem de serviço será registrada no sistema e ficará
                        disponível para atendimento pelo piloto designado. Caso
                        nenhum piloto específico tenha sido escolhido, a ordem
                        estará aberta para ser atendida por qualquer piloto
                        disponível.
                    </p>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.pilot.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Piloto (opcional)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.pilot.length > 0
                                    ? "Designado"
                                    : "Não Designado"}
                            </div>
                        </li>
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.client.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Cliente (opcional)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.client.length > 0
                                    ? "Designado"
                                    : "Não Designado"}
                            </div>
                        </li>
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.flightplans.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Planos de Voo (obrigatório)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.flightplans.length} Selecionados
                            </div>
                        </li>
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.drones.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Drones (opcional)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.drones.length} Selecionados
                            </div>
                        </li>
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.batteries.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Baterias (opcional)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.batteries.length} Selecionados
                            </div>
                        </li>
                        <li className="py-3 sm:py-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {renderStatus(form.data.equipments.length > 0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-medium text-gray-900 truncate dark:text-white">
                                    Equipamentos (opcional)
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                                {form.data.equipments.length} Selecionados
                            </div>
                        </li>
                    </ul>
                    <div className="flex justify-end gap-1 mt-10">
                        <Button
                            type="button"
                            text="Voltar"
                            onClick={() => router.get(route("service-orders.index"))}
                        />
                        <Button
                            processing={form.processing}
                            type="submit"
                            text="Confirmar"
                        />
                    </div>
                </div>
            </form>
        </>
    );
};
