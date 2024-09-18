import React from "react";
import { HouseIcon } from "../Icons/HouseIcon";

type BreadcrumbProps = {
    items: string[];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
    <ol className="flex items-center whitespace-nowrap">
        {/* Home is fixed */}
        <li className="inline-flex items-center">
            <span className="flex items-center text-md text-gray-500 dark:text-white focus:outline-none">
                <HouseIcon className="flex-shrink-0 me-3 size-4" />
                Home
            </span>
            <svg
                className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m9 18 6-6-6-6"></path>
            </svg>
        </li>

        {/* Map through items */}
        {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
                {index < items.length - 1 ? (
                    <>
                        <span className="text-md text-gray-500 dark:text-white focus:outline-none">
                            {item}
                        </span>
                        <svg
                            className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </>
                ) : (
                    // The last item is the current page, not a link
                    <span className="text-md font-semibold text-gray-800 dark:text-white truncate">
                        {item}
                    </span>
                )}
            </li>
        ))}
    </ol>
);
