import * as React from "react";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    className: string;
}

export function SearchIcon(props: Props) {
    return <MagnifyingGlassCircleIcon {...props} />;
}
