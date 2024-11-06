import clsx from 'clsx';
import { IconProps } from '.';

export default function Certificate({ className, transform, ...reset }: Readonly<IconProps>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-6 w-6', className)}
      transform={transform}
      {...reset}
    >
      <path
        d="M13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H17M6 7H18M6 10.5H9M6 14H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 16.5C15.7956 16.5 16.5587 16.1839 17.1213 15.6213C17.6839 15.0587 18 14.2956 18 13.5C18 12.7044 17.6839 11.9413 17.1213 11.3787C16.5587 10.8161 15.7956 10.5 15 10.5C14.2044 10.5 13.4413 10.8161 12.8787 11.3787C12.3161 11.9413 12 12.7044 12 13.5C12 14.2956 12.3161 15.0587 12.8787 15.6213C13.4413 16.1839 14.2044 16.5 15 16.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 20L17 21V15.736C17 15.736 16.43 16.5 15 16.5C13.57 16.5 13 15.75 13 15.75V21L15 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
