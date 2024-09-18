import * as React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

interface Props {
    className: string;
}

export function PlusIcon(props: Props) {
    return (
        <PlusCircleIcon {...props} />
    )
}