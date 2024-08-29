import * as React from "react";
import { Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";

const statusClassname: { [key: string]: string } = {
    verified: "h-2.5 w-2.5 rounded-full bg-green-500 mr-2",
    unverified: "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2",
    deleted: "h-2.5 w-2.5 rounded-full bg-red-500 mr-2",
};

export default function ShowPilot({ pilot }: any) {
    return (
        <AuthenticatedLayout>
            <ol className="flex items-center whitespace-nowrap">
                <li className="inline-flex items-center">
                    <a className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        <svg
                            className="flex-shrink-0 me-3 size-4"
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
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                    <svg
                        className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
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
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Usuários
                        <svg
                            className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
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
                    </span>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Pilotos
                        <svg
                            className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
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
                    </span>
                </li>
                <li
                    className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate"
                    aria-current="page"
                >
                    Visualizar
                </li>
            </ol>

            <section>
                <div className="py-8 mx-auto max-w-7xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Visualizar Piloto
                    </h2>
                    <div>
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Nome
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    value={pilot.data.name}
                                    id="name"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o nome completo"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    E-mail
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    value={pilot.data.email}
                                    id="email"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Status
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    value={pilot.data.status.title}
                                    id="email"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Criado em
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    value={pilot.data.created_at}
                                    id="email"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Última atualização
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    value={pilot.data.updated_at}
                                    id="email"
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
                                    placeholder="Informe o e-mail"
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
