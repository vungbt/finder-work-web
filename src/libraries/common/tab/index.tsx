import clsx from 'clsx';
import React, { ReactNode } from 'react';

export type TabItem = { label: string | ReactNode; value: string };
type TypeProps = {
  options: TabItem[];
  active?: TabItem;
  onChange?: (item: TabItem) => void;
};
export function Tab({ options, active, onChange }: TypeProps) {
  return (
    <ul className="flex items-center gap-4 text-sm">
      {options.map((item) => (
        <li
          onClick={() => onChange && onChange(item)}
          key={item.value}
          className={clsx(
            'text-dark opacity-50 transition-all ease-linear border-b-2 border-transparent py-1 hover:opacity-100 cursor-pointer',
            {
              'opacity-100 border-dark border-solid': active && item.value === active.value
            }
          )}>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
