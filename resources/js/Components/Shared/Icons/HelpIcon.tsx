import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function HelpIcon(props: Props) {
    return <QuestionMarkCircleIcon {...props} />;
}
