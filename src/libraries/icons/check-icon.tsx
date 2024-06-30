import clsx from 'clsx';
import { IconProps } from '.';

export default function CheckIcon({ className, transform, ...reset }: Readonly<IconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={clsx('h-6 w-6', className)}
      transform={transform}
      {...reset}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={reset.strokeWidth ?? 2}
        d="m5 12l5 5L20 7"
      />
    </svg>
  );
}
