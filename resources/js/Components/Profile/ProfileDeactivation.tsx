import * as React from "react";
import { useForm } from "@inertiajs/react";
import { InertiaInput } from "../Shared/Input/InertiaInput";

export function ProfileDeactivation() {
    const { data, setData, patch, processing, errors } = useForm({
        password: "",
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/deactivate", {
            preserveScroll: true,
        });
    };

    return (
        <form
            className="p-5 rounded-lg bg-white shadow dark:bg-gray-800"
            onSubmit={submit}
        >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Desativar a Conta
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-3">
                <div className="w-full">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm text-gray-900 dark:text-white"
                    >
                        Se você tem certeza, por favor insira sua senha abaixo
                        para confirmar:
                    </label>
                    <InertiaInput
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={setData}
                        id="password"
                        placeholder="Informe a senha"
                    />
                    <span className="text-red-500 text-sm">
                        {errors.password}
                    </span>
                </div>
            </div>
            <div className="text-right">
                <button
                    type="submit"
                    className="mt-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    {processing ? "Carregando ..." : "Desativar"}
                </button>
            </div>
        </form>
    );
}
