import { SVGAttributes } from 'react';
import BirdviewIcon from '../../../public/map/images/bv_icon.png';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <div>
            <h1 className="text-4xl font-extrabold text-neutral-700 dark:text-neutral-200 font-sans">Ordrone (alfa)</h1>
        </div>
    );
}
