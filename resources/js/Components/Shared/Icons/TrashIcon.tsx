import * as React from "react";
import { TrashIcon as TrashIcon_ } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function TrashIcon(props: Props) {
    return <TrashIcon_ {...props} />;
}
