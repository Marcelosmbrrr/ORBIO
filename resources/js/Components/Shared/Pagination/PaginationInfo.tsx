import * as React from 'react';

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Object[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export const PaginationInfo = ({ meta }: { meta: Meta }) => (
    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Registros encontrados:{" "}
            <span className="mx-1 font-semibold text-gray-900 dark:text-white">
                {meta.total}
            </span>{" "}
            | Páginas:{" "}
            <span className="mx-1 font-semibold text-gray-900 dark:text-white">
                {meta.last_page}
            </span>
        </span>
    </nav>
);