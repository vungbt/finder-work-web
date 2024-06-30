import clsx from 'clsx';
import { IconProps } from '.';

export default function BookmarkBold({ className, transform, ...reset }: Readonly<IconProps>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-6 w-6', className)}
      transform={transform}
      {...reset}
    >
      <path
        d="M16.444 3c1.178 0 2.152.917 2.224 2.092l.926 15.317a.557.557 0 01-.887.482l-6.247-4.616c-.394-.29-.931-.29-1.324 0L4.888 20.89a.557.557 0 01-.887-.482l.926-15.317A2.228 2.228 0 017.15 3h9.293z"
        fill="currentcolor"
        fillRule="evenodd"
      ></path>
    </svg>
  );
}
