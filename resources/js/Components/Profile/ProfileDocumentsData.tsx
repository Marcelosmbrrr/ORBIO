import * as React from "react";
import { useForm, usePage } from "@inertiajs/react";
import { InertiaInput } from "../Shared/Input/InertiaInput";

export function ProfileDocumentalData() {
    const { profile }: any = usePage().props;

    const { data, setData, patch, errors, processing } = useForm({
        cpf: profile.data.documents.cpf,
        cnpj: profile.data.documents.cnpj,
        company_name: profile.data.documents.company_name,
        trading_name: profile.data.documents.trading,
        anac_license: profile.data.documents.anac_license,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch("/profile/document");
    };

    return (
        <form
            className="p-5 rounded-lg bg-white shadow dark:bg-gray-800 h-fit"
            onSubmit={submit}
        >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Documentos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full">
                    <label
                        htmlFor="cpf"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        CPF
                    </label>
                    <InertiaInput
                        placeholder="Informe o cpf"
                        type="text"
                        name="cpf"
                        id="cpf"
                        value={data.cpf}
                        onChange={setData}
                    />
                    <span className="text-red-500 text-sm">{errors.cpf}</span>
                </div>

                {!!profile.data.field_control.cnpj && (
                    <div className="w-full">
                        <label
                            htmlFor="cnpj"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            CNPJ
                        </label>
                        <InertiaInput
                            placeholder="Informe o CNPJ"
                            type="text"
                            name="cnpj"
                            id="cnpj"
                            value={data.cnpj}
                            onChange={setData}
                        />
                        <span className="text-red-500 text-sm">
                            {errors.cnpj}
                        </span>
                    </div>
                )}

                {!!profile.data.field_control.company_name && (
                    <div className="w-full">
                        <label
                            htmlFor="company_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Nome Fantasia
                        </label>
                        <InertiaInput
                            placeholder="Informe o nome fantasia"
                            type="text"
                            name="company_name"
                            id="company_name"
                            value={data.company_name}
                            onChange={setData}
                        />
                        <span className="text-red-500 text-sm">
                            {errors.company_name}
                        </span>
                    </div>
                )}

                {!!profile.data.field_control.trading_name && (
                    <div className="w-full">
                        <label
                            htmlFor="trading_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Razão Social
                        </label>
                        <InertiaInput
                            placeholder="Informe a razão social"
                            type="text"
                            name="trading_name"
                            id="trading_name"
                            value={data.trading_name}
                            onChange={setData}
                        />
                        <span className="text-red-500 text-sm">
                            {errors.trading_name}
                        </span>
                    </div>
                )}

                {!!profile.data.field_control.anac_license && (
                    <div className="w-full">
                        <label
                            htmlFor="anac_license"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Licença Anac
                        </label>
                        <InertiaInput
                            placeholder="Informe a licença anac"
                            type="text"
                            name="anac_license"
                            id="anac_license"
                            value={data.anac_license}
                            onChange={setData}
                        />
                        <span className="text-red-500 text-sm">
                            {errors.anac_license}
                        </span>
                    </div>
                )}
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
