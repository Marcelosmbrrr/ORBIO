import * as React from "react";

interface Props {
    text: string;
    hint?: string;
    htmlFor: string;
}

export function InputLabel({ text, hint, htmlFor }: Props) {
    return (
        <div className="mb-2">
            <label
                htmlFor={htmlFor}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {text}
            </label>
            {hint && <span className="text-gray-400 text-sm">{hint}</span>}
        </div>
    );
}
