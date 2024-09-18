import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function SuccessIcon(props: Props) {
    return <CheckCircleIcon {...props} />;
}
