import * as React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';

interface Props {
    className: string;
}

export function PenIcon(props: Props) {
    return (
        <PencilSquareIcon {...props} />
    )
}