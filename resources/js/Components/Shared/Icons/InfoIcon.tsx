import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function InfoIcon(props: Props) {
    return <InformationCircleIcon {...props} />;
}
