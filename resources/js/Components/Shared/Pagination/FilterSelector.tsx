import React from 'react';

interface FilterSelectorProps {
    currentGroup: string;
    onChange: (option: any) => void;
    options: string[];
    labels: { [key: string]: string };
}

export const FilterSelector = ({
    currentGroup,
    onChange,
    options,
    labels
}: FilterSelectorProps) => {
    return (
        <div className="flex space-x-3">
            <span className="font-medium text-gray-900 dark:text-white">
                Filtrar:
            </span>
            <div className="flex">
                {options.map((option) => (
                    <div key={option} className="flex items-center me-4">
                        <input
                            checked={currentGroup === option}
                            onClick={() => onChange(option)}
                            id={`inline-${option}-radio`}
                            type="radio"
                            name="inline-radio-option"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                            htmlFor={`inline-${option}-radio`}
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            {labels[option]}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

