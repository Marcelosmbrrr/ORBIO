import * as React from "react";

interface IconButtonProps {
    onClick?: () => void;
    icon: React.ElementType;
    buttonClassName?: string;
    iconClassName?: string;
}

export function IconButton({
    icon: Icon,
    buttonClassName,
    iconClassName,
    onClick,
}: IconButtonProps) {
    return (
        <button onClick={onClick} className={"text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-600 " + buttonClassName}>
            <Icon className={"mr-2 w-5 h-5 " + iconClassName} />
        </button>
    );
}
