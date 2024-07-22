import * as React from 'react';
// Custom
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { ProfileBasicData } from '@/Components/Profile/ProfileBasicData';
import { ProfileDocumentalData } from '@/Components/Profile/ProfileDocumentsData';
import { ProfileAddressData } from '@/Components/Profile/ProfileAddressData';
import { ProfileContactData } from '@/Components/Profile/ProfileContactData';
import { ProfileChangePassword } from '@/Components/Profile/ProfileChangePassword';
import { ProfileDeactivation } from '@/Components/Profile/ProfileDeactivation';
import { Alert } from '@/Components/Alert';

export default function Profile({ success }: any) {

    return (
        <AuthenticatedLayout>
            <ol className="flex items-center whitespace-nowrap mb-5">
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        <svg className="flex-shrink-0 me-3 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </span>
                    <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </li>
                <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
                    Minha Conta
                </li>
            </ol>

            {success &&
                <Alert type='success' message={success} />
            }

            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 auto-rows-min w-full">
                <ProfileBasicData />
                <ProfileDocumentalData />
                <ProfileAddressData />
                <ProfileContactData />
                <ProfileChangePassword />
                <ProfileDeactivation />
            </div>
        </AuthenticatedLayout>
    )
}