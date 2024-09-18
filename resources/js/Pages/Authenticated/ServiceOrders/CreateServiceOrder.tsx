import * as React from "react";
import { useForm, router } from "@inertiajs/react";
import { useSnackbar } from "notistack";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { PilotStep } from "@/Components/ServiceOrders/Creation/PilotStep";
import { ClientStep } from "@/Components/ServiceOrders/Creation/ClientStep";
import { FlightPlanStep } from "@/Components/ServiceOrders/Creation/FlightPlanStep";
import { DroneStep } from "@/Components/ServiceOrders/Creation/DroneStep";
import { BatteryStep } from "@/Components/ServiceOrders/Creation/BatteryStep";
import { EquipmentStep } from "@/Components/ServiceOrders/Creation/EquipmentStep";
import { ConfirmationStep } from "@/Components/ServiceOrders/Creation/ConfirmationStep";

const steps = [
    "pilots",
    "clients",
    "flightplans",
    "drones",
    "batteries",
    "equipments",
    "confirmation",
];
const totalStepIndex = steps.length - 1;

const CreateServiceOrder: React.FC = React.memo(() => {
    const form = useForm({
        pilot: [],
        client: [],
        flightplans: [],
        drones: [],
        batteries: [],
        equipments: [],
    });

    const { enqueueSnackbar } = useSnackbar();

    const submit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (form.data.flightplans.length === 0) {
                enqueueSnackbar("Selecione pelo menos 1 plano de voo.", {
                    variant: "error",
                });
                return;
            }

            form.post("/service-orders");
        },
        [form]
    );

    const [stepIndex, setStepIndex] = React.useState(0);
    const progress = Math.ceil(((stepIndex + 1) / steps.length) * 100);

    /**
     * First fetch of the phase - executed only on phase change
     * The fetches within each phase are reloads of the same phase
     *
     */
    const fetchData = React.useCallback((newStepIndex: number) => {
        const stepDataKey = steps[newStepIndex];

        router.visit("/service-orders/create", {
            only: [stepDataKey],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setStepIndex(newStepIndex),
        });
    }, []);

    const handleNext = React.useCallback(() => {
        if (stepIndex < totalStepIndex) {
            fetchData(stepIndex + 1);
        }
    }, [stepIndex]);

    const handleBack = React.useCallback(() => {
        if (stepIndex > 0) {
            fetchData(stepIndex - 1);
        }
    }, [stepIndex]);

    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Ordens de Serviço", "Criar"]} />
            <section>
                <div className="mx-auto py-10">
                    <div className="mb-10">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Criar Ordem de Serviço
                        </h2>
                    </div>
                    <div>
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white">
                                Procedimento {stepIndex + 1}/7
                            </h3>
                            <span className="text-sm text-gray-800 dark:text-white">
                                {progress}%
                            </span>
                        </div>
                        <div
                            className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-5">
                        <button
                            type="button"
                            className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleBack}
                            disabled={stepIndex === 0}
                        >
                            <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6"></path>
                            </svg>
                            Anterior
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleNext}
                            disabled={stepIndex === totalStepIndex}
                        >
                            Próximo
                            <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m9 18 6-6-6-6"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="mt-5">
                        <RenderStep
                            stepIndex={stepIndex}
                            form={form}
                            submit={submit}
                        />
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
});

interface RenderStepProps {
    stepIndex: number;
    form: any;
    submit: (e: React.FormEvent) => void;
}

const RenderStep: React.FC<RenderStepProps> = ({ stepIndex, form, submit }) => {
    switch (stepIndex) {
        case 0:
            return (
                <PilotStep selection={form.data.pilot} setData={form.setData} />
            );
        case 1:
            return (
                <ClientStep
                    selection={form.data.client}
                    setData={form.setData}
                />
            );
        case 2:
            return (
                <FlightPlanStep
                    selection={form.data.flightplans}
                    setData={form.setData}
                />
            );
        case 3:
            return (
                <DroneStep
                    selection={form.data.drones}
                    setData={form.setData}
                />
            );
        case 4:
            return (
                <BatteryStep
                    selection={form.data.batteries}
                    setData={form.setData}
                />
            );
        case 5:
            return (
                <EquipmentStep
                    selection={form.data.equipments}
                    setData={form.setData}
                />
            );
        case 6:
            return <ConfirmationStep form={form} submit={submit} />;
        default:
            return null;
    }
};

export default CreateServiceOrder;
