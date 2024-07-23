import * as React from 'react';
import { useState } from 'react';

export function Alert(props: { message: string, type: "success" | "error" }) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleClose = () => setVisible(false);

    return (
        <div className={`my-2 border-t-2 p-3 dark:bg-opacity-30 ${props.type === 'success' ? 'bg-teal-50 border-teal-500 dark:bg-teal-800/30' : 'bg-red-50 border-red-500 dark:bg-red-800/30'}`} role="alert" tabIndex={-1} aria-labelledby="hs-bordered-alert-label">
            <div className="flex justify-between">
                <div className="flex">
                    <div className="shrink-0">
                        <span className={`inline-flex justify-center items-center size-8 rounded-full border-4 ${props.type === 'success' ? 'border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400' : 'border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400'}`}>
                            {props.type === 'success' ? (
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            ) : (
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            )}
                        </span>
                    </div>
                    <div className="ms-3">
                        <h3 id="hs-bordered-alert-label" className="text-gray-800 font-semibold dark:text-white">
                            {props.type === 'success' ? 'Sucesso!' : 'Erro!'}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                            {props.message}
                        </p>
                    </div>
                </div>
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                    <span className="sr-only">Fechar alerta</span>
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
