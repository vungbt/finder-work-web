import clsx from 'clsx';
import { IconProps } from '.';

export default function Growth({ className, transform, ...reset }: Readonly<IconProps>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-6 w-6', className)}
      transform={transform}
      {...reset}
    >
      <g clip-path="url(#clip0_185_3847)">
        <path
          d="M9.00797 6.70896L12.438 5.19296V12.865H9.00797V6.70896ZM9.00797 6.70896L6.86397 7.84596L4.71997 4.81396V12.863H9.00797V6.70896Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.2899 1.13696L7.85093 4.61296L5.35093 1.68996L0.87793 3.98796M1.28993 6.32996L4.71993 4.81396V12.864H1.28993V6.32996Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5859 0.677979L13.2889 1.12798L12.8389 3.83198"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_185_3847">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
