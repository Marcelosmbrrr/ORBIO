import * as React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon, FunnelIcon } from '@heroicons/react/16/solid'

interface Option {
    id: string;
    name: string;
}

interface Props {
    value: string;
    options: Option[];
    changeOrderBy: Function
}

export const OrderSelector = React.memo((props: Props) => {

    const [selected, setSelected] = React.useState<string>(props.value);

    function handleSelection(option_id: string) {
        if (option_id != selected) {
            setSelected(option_id);
            props.changeOrderBy(option_id)
        }
    }

    return (
        <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 py-2 px-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-700 data-[open]:bg-green-700 data-[focus]:outline-1 data-[focus]:outline-white">
                <FunnelIcon className="size-4 fill-white" />
                Ordem:
                <ChevronDownIcon className="size-4 fill-white/60" />
            </MenuButton>
            <Transition
                enter="transition ease-out duration-75"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <MenuItems
                    anchor="bottom end"
                    className="w-52 origin-top-right rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-1 text-sm/6 text-gray-900 dark:text-white [--anchor-gap:var(--spacing-1)] focus:outline-none"
                >
                    {props.options.map((option: Option) =>
                        <MenuItem>
                            <button onClick={() => handleSelection(option.id)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                {option.id === selected && <CheckIcon className="size-4 fill-gray-900 dark:fill-white" />}
                                {option.name}
                            </button>
                        </MenuItem>
                    )}
                </MenuItems>
            </Transition>
        </Menu>
    )
});