import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
// Custom
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Esqueceu a senha" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Esqueceu a senha? Informe o e-mail cadastrado abaixo para
                receber o link de recuperação da sua conta.
            </div>

            <form className="mb-2" onSubmit={submit}>
                <div>
                    <label
                        htmlFor="email"
                        className="block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        E-mail
                    </label>
                    <InertiaInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={setData}
                        placeholder={"Informe o e-mail"}
                    />
                    <p className={"text-sm text-red-600 mt-2"}>
                        {errors.email}
                    </p>
                </div>

                <div className="flex items-center justify-end mt-4 gap-x-3">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 dark:text-white hover:text-gray-900 rounded-md focus:outline-none"
                    >
                        Voltar
                    </Link>
                    <Button
                        processing={processing}
                        type="submit"
                        text="Enviar Link"
                    />
                </div>
            </form>

            {status && <Alert message={status} type="success" />}
        </GuestLayout>
    );
}
