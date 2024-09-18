import { useEffect, FormEventHandler } from "react";
import { Head, useForm } from "@inertiajs/react";
// Custom
import GuestLayout from "@/Layouts/GuestLayout";
import { InertiaInput } from "@/Components/Shared/Input/InertiaInput";
import { Button } from "@/Components/Shared/Buttons/Button";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    console.log(status);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    return (
        <GuestLayout>
            <Head title="Alterar a Senha" />
            <form onSubmit={submit}>
                <div>
                    <label
                        htmlFor="email"
                        className="block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <p className={"text-sm text-red-600 mt-2"}>
                        {errors.email}
                    </p>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="email"
                        className="block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        Senha
                    </label>
                    <InertiaInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={setData}
                        placeholder={"Informe a nova senha"}
                    />
                    <p className={"text-sm text-red-600 mt-2"}>
                        {errors.password}
                    </p>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="password_confirmation"
                        className="block font-medium text-sm text-gray-700 dark:text-gray-300"
                    >
                        Confirmar senha
                    </label>
                    <InertiaInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={setData}
                        placeholder={"Informe a senha novamente"}
                    />
                    <p className={"text-sm text-red-600 mt-2"}>
                        {errors.password_confirmation}
                    </p>
                </div>
                <div className="flex items-center justify-end mt-4">
                    <Button
                        processing={processing}
                        type="submit"
                        text="Confirmar"
                    />
                </div>
            </form>
        </GuestLayout>
    );
}
