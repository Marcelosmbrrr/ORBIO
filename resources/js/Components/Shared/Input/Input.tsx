import * as React from "react";

interface InputProps {
    type: string;
    id: string;
    name?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    value: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}

export function Input({
    type,
    id,
    name,
    onChange,
    placeholder,
    value,
    onKeyDown,
    readOnly,
}: InputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <input
            type={type}
            id={id}
            name={name}
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-900 dark:text-neutral-400 dark:placeholder-neutral-300 dark:focus:ring-blue-600"
        />
    );
}
