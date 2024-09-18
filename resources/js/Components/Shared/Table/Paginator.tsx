import * as React from 'react';

export const Paginator = ({
    current_page,
    pages,
    changePage,
}: {
    current_page: number;
    pages: number;
    changePage: (page: number) => void;
}) => {
    const getPageNumbers = () => {
        if (pages <= 3) {
            return [...Array(pages)].map((_, i) => i + 1);
        }

        if (current_page <= 3) {
            return [1, 2, 3, pages];
        }

        if (current_page > 3 && current_page < pages - 2) {
            return [current_page - 1, current_page, current_page + 1, pages];
        }

        return [pages - 2, pages - 1, pages];
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="mt-4">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => changePage(1)}
                        disabled={current_page === 1}
                        className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg ${
                            current_page === 1
                                ? "opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                        } dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`}
                    >
                        &laquo;
                    </button>
                </li>
                <li>
                    <button
                        onClick={() =>
                            changePage(Math.max(current_page - 1, 1))
                        }
                        disabled={current_page === 1}
                        className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 ${
                            current_page === 1
                                ? "opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                        } dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`}
                    >
                        &lt;
                    </button>
                </li>
                {pageNumbers.map((page, i) => (
                    <li key={i}>
                        {i === 3 &&
                        pageNumbers.length > 3 &&
                        current_page <= pages - 3 ? (
                            <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                                ...
                            </span>
                        ) : (
                            <button
                                onClick={() => changePage(page)}
                                className={`px-3 py-2 font-semibold leading-tight ${
                                    current_page === page
                                        ? "text-blue-600 bg-blue-50 dark:bg-gray-600 dark:text-white"
                                        : "text-gray-500 bg-white dark:bg-gray-700 dark:text-gray-400"
                                } border border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() =>
                            changePage(Math.min(current_page + 1, pages))
                        }
                        disabled={current_page === pages}
                        className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 ${
                            current_page === pages
                                ? "opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                        } dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`}
                    >
                        &gt;
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => changePage(pages)}
                        disabled={current_page === pages}
                        className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg ${
                            current_page === pages
                                ? "opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                        } dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};
