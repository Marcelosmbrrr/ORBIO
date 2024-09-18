import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'dark-primary': '#18181A',
                'dark-secundary': '#1F1F23',
                'green-primary': '#15803d',
                'green-secundary': '#166534',
                'blue-primary': '#1e40af',
                'blue-secundary': '#1d4ed8'
            }
        }
    },

    plugins: [forms],
};
