import * as React from "react";
import { useForm, usePage } from "@inertiajs/react";
import { InertiaInput } from "../Shared/Input/InertiaInput";

export function ProfileContactData() {
    const { profile }: any = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        ddd: profile.data.contact.ddd,
        phone_number: profile.data.contact.phone_number,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/contact");
    };

    return (
        <form
            className="p-5 rounded-lg bg-white shadow dark:bg-gray-800"
            onSubmit={submit}
        >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Contato
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full">
                    <label
                        htmlFor="ddd"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        DDD (Código de área)
                    </label>
                    <InertiaInput
                        type="text"
                        name={"ddd"}
                        id="ddd"
                        value={data.ddd}
                        onChange={setData}
                        placeholder="Informe o DDD"
                    />
                    <span className="text-red-500 text-sm">{errors.ddd}</span>
                </div>
                <div className="w-full">
                    <label
                        htmlFor="phone_number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Número de Telefone
                    </label>
                    <InertiaInput
                        type="text"
                        name="phone_number"
                        value={data.phone_number}
                        onChange={setData}
                        id="phone_number"
                        placeholder="Informe o número"
                    />
                    <span className="text-red-500 text-sm">
                        {errors.phone_number}
                    </span>
                </div>
            </div>
            <div className="text-right">
                <button
                    disabled={processing}
                    type="submit"
                    className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    {processing ? "Carregando ..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    );
}
