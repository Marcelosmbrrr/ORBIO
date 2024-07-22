import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { SnackbarProvider, closeSnackbar } from 'notistack';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <SnackbarProvider
                maxSnack={3}
                action={(snackbarId) => (
                    <button onClick={() => closeSnackbar(snackbarId)}>
                        Fechar
                    </button>
                )}
            >
                <App {...props} />
            </SnackbarProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
