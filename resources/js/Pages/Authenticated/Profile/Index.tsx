import * as React from "react";
// Custom
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { ProfileBasicData } from "@/Components/Profile/ProfileBasicData";
import { ProfileDocumentalData } from "@/Components/Profile/ProfileDocumentsData";
import { ProfileAddressData } from "@/Components/Profile/ProfileAddressData";
import { ProfileContactData } from "@/Components/Profile/ProfileContactData";
import { ProfileChangePassword } from "@/Components/Profile/ProfileChangePassword";
import { ProfileDeactivation } from "@/Components/Profile/ProfileDeactivation";
import { Alert } from "@/Components/Shared/Alert/Alert";
import { Breadcrumb } from "@/Components/Shared/Breadcrumb/Breadcrumb";

export default function Profile({ success }: any) {
    return (
        <AuthenticatedLayout>
            <Breadcrumb items={["Minha Conta"]} />

            {success && <Alert type="success" message={success} />}

            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 auto-rows-min mt-5 w-full">
                <ProfileBasicData />
                <ProfileDocumentalData />
                <ProfileAddressData />
                <ProfileContactData />
                <ProfileChangePassword />
                <ProfileDeactivation />
            </div>
        </AuthenticatedLayout>
    );
}
