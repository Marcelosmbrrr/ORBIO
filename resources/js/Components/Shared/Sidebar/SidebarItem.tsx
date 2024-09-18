import * as React from "react";
import { Link } from "@inertiajs/react";

interface SidebarItemProps {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: React.ReactNode;
    method?: "post";
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    href,
    icon: Icon,
    label,
    children,
    method,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <li className="group relative">
            {href ? (
                <Link
                    href={href}
                    {...(method && { method })}
                    {...(method === "post" && { as: "button", type: "button" })}
                    className="w-full flex items-center p-3 rounded-lg text-white hover:bg-gray-800 cursor-pointer group"
                >
                    <div className="flex p-1 rounded">
                        <Icon className="w-5 h-5 text-white transition duration-75" />
                        <span className="ms-3 whitespace-nowrap">{label}</span>
                    </div>
                </Link>
            ) : (
                <div
                    onClick={toggleDropdown}
                    className="flex items-center p-3 rounded-lg text-white hover:bg-gray-800 cursor-pointer group"
                >
                    <div className="p-1 rounded">
                        <Icon className="flex-shrink-0 w-5 h-5 text-white transition duration-75" />
                    </div>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                        {label}
                    </span>
                    {children && (
                        <svg
                            className={`w-3 h-3 text-white transition-transform duration-200 ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 9-7 7-7-7"
                            />
                        </svg>
                    )}
                </div>
            )}
            {children && (
                <ul
                    className={`pl-4 border-l-2 border-gray-600 transition-all duration-200 ${
                        isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
                    }`}
                >
                    {children}
                </ul>
            )}
        </li>
    );
};
