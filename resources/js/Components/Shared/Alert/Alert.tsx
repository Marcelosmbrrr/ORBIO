import * as React from "react";
import { useState } from "react";
import { SuccessIcon } from "../Icons/SuccessIcon";
import { ErrorIcon } from "../Icons/ErrorIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { CloseIcon } from "../Icons/CloseIcon";

interface AlertProps {
    message: string;
    type: "success" | "error" | "alert";
}

const icons = {
    success: <SuccessIcon className="mr-2 text-green-600 w-5 h-5" />,
    error: <ErrorIcon className="mr-2 text-red-600 w-5 h-5" />,
    alert: <InfoIcon className="mr-2 text-yellow-600 w-5 h-5" />,
};

export function Alert({ message, type }: AlertProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleClose = () => setVisible(false);

    return (
        <div
            className="mb-5 bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-900 dark:border-gray-800"
            role="alert"
        >
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div>{icons[type]}</div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-neutral-400">
                        {message}
                    </div>
                </div>
                <button type="button" onClick={handleClose}>
                    <CloseIcon className="w-4 h-4 dark:text-white" />
                </button>
            </div>
        </div>
    );
}
