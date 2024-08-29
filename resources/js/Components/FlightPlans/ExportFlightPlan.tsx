import * as React from "react";

interface Props {
    handleExport: Function
}

export const ExportFlightPlan = React.memo((props: Props) => {

    return ( 
        <button className="text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-600" onClick={() => props.handleExport()}>
            <svg
                className="w-5 h-5 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fillRule="evenodd"
                    d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
});
