import ApplicationLogo from '@/Components/Shared/Logo/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { useTheme } from '@/Hooks/useTheme';

export default function Guest({ children }: PropsWithChildren) {

    const { ThemeButton } = useTheme();

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50 dark:bg-gray-900">

            <div className="absolute right-5 top-5">
                <ThemeButton />
            </div>

            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
