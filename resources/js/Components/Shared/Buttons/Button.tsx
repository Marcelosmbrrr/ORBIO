interface ButtonProps {
    processing?: boolean;
    type: "button" | "submit" | "reset";
    text: string;
    onClick?: () => void;
    icon?: React.ElementType;
    className?: string;
}

export function Button({
    icon: Icon,
    className,
    text,
    processing,
    type,
    onClick,
}: ButtonProps) {

    return (
        <button
            disabled={processing}
            type={type}
            onClick={onClick}
            className={
                "flex items-center focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 " +
                className
            }
        >
            {Icon && <Icon className="mr-2 w-5 h-5" />}
            {processing ? "Carregando..." : text}
        </button>
    );
}
