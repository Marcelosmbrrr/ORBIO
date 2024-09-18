import { PageProps as InertiaPageProps } from "@inertiajs/core";
import * as React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
// Custom
import GuestLayout from "@/Layouts/GuestLayout";
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { Button } from "@/Components/Shared/Buttons/Button";

interface CustomPageProps extends InertiaPageProps {
    success?: string;
    error?: string;
}

export default function Login() {
    const { props } = usePage<CustomPageProps>();
    const { success, error } = props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <form className="mb-2" onSubmit={submit}>
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1 block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <InertiaInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={setData}
                        placeholder={"Informe o e-mail"}
                    />
                    <p className="text-sm text-red-600 mt-2">{errors.email}</p>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="password"
                        className="mb-1 block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        Senha
                    </label>
                    <InertiaInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={setData}
                        placeholder={"Informe a senha"}
                    />
                    <p className="text-sm text-red-600 mt-2">
                        {errors.password}
                    </p>
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <input
                            name="remember"
                            checked={data.remember}
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 text-sm"
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-300">
                            Lembrar
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4 gap-x-3">
                    <Link
                        href={route("password.request")}
                        className="underline text-sm text-gray-600 dark:text-white hover:text-gray-900 rounded-md focus:outline-none"
                    >
                        Esqueceu a senha?
                    </Link>
                    <Button
                        processing={processing}
                        type="submit"
                        text="Acessar"
                    />
                </div>
            </form>

            {success && <Alert message={success} type="success" />}

            {error && <Alert message={error} type="error" />}
        </GuestLayout>
    );
}
