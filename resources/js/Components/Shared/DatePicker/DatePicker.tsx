import React from "react";

interface DatePickerProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    id,
    label,
    value,
    onChange,
    error,
}) => {
    return (
        <div className="sm:col-span-1">
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <input
                type="date"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};
