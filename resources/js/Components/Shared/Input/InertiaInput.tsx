interface Props {
    type: string;
    id: string;
    name: string;
    onChange: (field: string, value: string) => void; // Modificado para aceitar o nome do campo e o valor
    placeholder: string;
    value: string;
    readonly?: boolean;
}

export function InertiaInput({ type, id, name, onChange, placeholder, value, readonly }: Props) {
    return (
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            readOnly={readonly}
            value={value}
            onChange={(e) => onChange(name, e.target.value)} 
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-300 dark:bg-gray-700 dark:border-gray-800 dark:text-neutral-400 dark:focus:ring-blue-600"
        />
    );
}
