import React from "react";

interface FileInputProps {
    accept: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

export const FileInput: React.FC<FileInputProps> = ({
    accept = [],
    onChange,
    id,
}) => {
    return (
        <div>
            <input
                onChange={onChange}
                accept={accept.join(", ")}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id={id}
                type="file"
            />
        </div>
    );
};
