import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "../Buttons/Button";
import { TrashIcon } from "../Icons/TrashIcon";

interface Props {
    can_open: boolean;
    request_url: string;
    action: "delete" | "undelete";
    reload: Function;
}

export function DeleteOrUndeleteResource(props: Props) {
    const [open, setOpen] = React.useState(false);
    const form = useForm();

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        if (props.action === "delete") {
            form.delete(props.request_url, {
                preserveState: false,
                onSuccess: (e) => {
                    setOpen(false);
                },
            });
        } else {
            form.patch(props.request_url, {
                preserveState: false,
                onSuccess: () => {
                    setOpen(false);
                },
            });
        }
    };

    if (!props.can_open) {
        return "";
    }

    return (
        <>
            <Button
                icon={TrashIcon}
                onClick={() => setOpen(true)}
                text={props.action === "delete" ? "Deletar" : "Recuperar"}
                type="button"
                processing={false}
            />

            <Transition.Root show={open} as={React.Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon
                                                    className="h-6 w-6 text-red-600"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    {props.action === "delete"
                                                        ? "Deletar Recurso"
                                                        : "Recuperar Recurso"}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {props.action ===
                                                        "delete"
                                                            ? "Tem certeza que quer deletar os recursos selecionados?"
                                                            : "Tem certeza que quer recuperar os recursos selecionados?"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form
                                        className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                                        onSubmit={submit}
                                    >
                                        <button
                                            disabled={form.processing}
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            {form.processing
                                                ? "Carregando ..."
                                                : "Confirmar"}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
