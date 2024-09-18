import * as React from "react";
import { useForm, router } from "@inertiajs/react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { logValidation } from "@/Utils/LogValidation";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { Button } from "@/Components/Shared/Buttons/Button";
import { FileInput } from "@/Components/Shared/Input/FileInput";

interface Props {
    service_order_id: string;
}

type ProcessingLog = {
    file: File;
    filename: string;
    extension: string;
    size: string;
    validation: { result: boolean; key: "valid" | "invalid"; message: string };
};

const validationClassName = {
    valid: "flex w-2.5 h-2.5 bg-green-600 rounded-full me-1.5 flex-shrink-0",
    invalid: "flex w-2.5 h-2.5 bg-red-600 rounded-full me-1.5 flex-shrink-0",
};

export default function CreateLog(props: Props) {
    const [logs, setLogs] = React.useState<ProcessingLog[]>([]);

    const { post, setData, processing } = useForm({
        logs: [] as File[],
    });

    function handleSubmit() {
        const url = window.location.pathname.replace("/create", "");
        post(url);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const newLogsPromises = files.map(async (file) => {
            const { verified_file, result, key, message } = await logValidation(
                file
            );

            if (verified_file) {
                const { name, size } = verified_file;
                const extension = name.split(".").pop() || "";

                return {
                    file: verified_file,
                    filename: name,
                    extension,
                    size: `${(size / 1024).toFixed(2)} KB`,
                    validation: { result, key, message },
                };
            }

            return null;
        });

        const newLogs = (await Promise.all(newLogsPromises)).filter(
            (log) => log !== null
        ) as ProcessingLog[];
        setLogs(newLogs);
        setData(
            "logs",
            newLogs.map((log) => log.file)
        );
    }

    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Ordens de Serviço", "Logs", "Criar"]} />
            <section>
                <div className="mx-auto py-16">
                    <div className="mb-5">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Criar Log
                        </h2>
                    </div>

                    <div>
                        <div className="mb-5">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Clique no botão abaixo para abrir o
                                    procurador de arquivos do seu computador e
                                    selecionar arquivos de log. Ao
                                    seleciona-los, serão listados abaixo e
                                    também verificados. Os que forem inválidos
                                    não serão salvos.
                                </p>
                            </div>
                            <div className="mt-5 flex justify-between items-center">
                                <FileInput
                                    accept={[".tlog.kmz", ".kml"]}
                                    onChange={handleUpload}
                                    id={"log"}
                                />
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        text="Voltar"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "service-orders.show",
                                                    props.service_order_id
                                                )
                                            )
                                        }
                                    />
                                    <Button
                                        processing={processing}
                                        type="submit"
                                        text="Confirmar"
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 overflow-x-auto sm:rounded-lg">
                            <div className="my-2">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Arquivos: {logs.length}
                                </p>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-800 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="text-left px-6 py-3"
                                        >
                                            Nome
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-left px-6 py-3"
                                        >
                                            Tamanho
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-left px-6 py-3"
                                        >
                                            Extensão
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-right px-6 py-3"
                                        >
                                            Verificação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr
                                                key={log.filename}
                                                className="bg-white dark:text-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50"
                                            >
                                                <td className="text-left px-6 py-4">
                                                    {log.filename}
                                                </td>
                                                <td className="text-left px-6 py-4">
                                                    {log.size}
                                                </td>
                                                <td className="text-left px-6 py-4">
                                                    {log.extension}
                                                </td>
                                                <td className="flex justify-end px-6 py-4">
                                                    <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
                                                        <span
                                                            className={
                                                                validationClassName[
                                                                    log
                                                                        .validation
                                                                        .key
                                                                ]
                                                            }
                                                        ></span>
                                                        {log.validation.message}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 whitespace-nowrap dark:text-white"
                                            >
                                                <div className="flex items-center justify-center">
                                                    Nenhum log selecionado.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
