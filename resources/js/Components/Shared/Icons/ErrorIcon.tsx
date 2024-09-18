import { XCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function ErrorIcon(props: Props) {
    return <XCircleIcon {...props} />;
}
