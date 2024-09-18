import { XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function CloseIcon(props: Props) {
    return <XMarkIcon {...props} />;
}
