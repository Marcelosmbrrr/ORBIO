import * as React from 'react';
import { SunIcon } from '@heroicons/react/24/solid';
import { MoonIcon } from '@heroicons/react/24/solid';

export function useTheme() {

    const [theme, setTheme] = React.useState("dark");

    React.useEffect(() => {
        const savedTheme = localStorage.getItem("portfolio-smbr-theme");
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === "light") {
                document.body.classList.remove("dark");
            }
        } else {
            localStorage.setItem("portfolio-smbr-theme", "dark");
        }
    }, []);

    const toggleTheme = () => {
        if (theme === "dark") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("portfolio-smbr-theme", newTheme);
    };

    const ThemeButton = () => (
        <button onClick={toggleTheme} type="button" className="text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2">
            {theme === "dark" ? <MoonIcon className="size-6 fill-white" /> : <SunIcon className="size-6 fill-gray-800" />}
        </button>
    );

    return { theme, toggleTheme, ThemeButton };
}