import clsx from 'clsx';
import { IconProps } from '.';

export default function Logo({ className, transform, ...reset }: Readonly<IconProps>) {
  return (
    <svg
      width="97"
      height="120"
      viewBox="0 0 97 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-6 w-6', className)}
      transform={transform}
      {...reset}
    >
      <path
        d="M96.5924 47.9995V62.3996C96.5924 77.6762 90.5238 92.327 79.7217 103.129C68.9195 113.931 54.2686 120 38.992 120H0.591797V71.9997H24.592V95.9998H34.192C44.3764 95.9998 54.1437 91.9541 61.3451 84.7526C68.5466 77.5512 72.5923 67.7839 72.5923 57.5996V47.9995H96.5924Z"
        fill="url(#paint0_angular_1855_71671)"
      />
      <path d="M96.5939 0H72.5938V24.0002H96.5939V0Z" fill="#7AFB3D" />
      <path d="M72.59 24.0015H48.5898V48.0016H72.59V24.0015Z" fill="#FB8D8D" />
      <path
        d="M24.5938 47.9995H48.5939V59.9996C48.5939 63.1822 47.3296 66.2345 45.0792 68.4849C42.8287 70.7354 39.7764 71.9997 36.5938 71.9997H24.5938V47.9995Z"
        fill="#586EE0"
      />
      <defs>
        <radialGradient
          id="paint0_angular_1855_71671"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(42.1636 85.7148) rotate(24.444) scale(25.8924 27.2115)"
        >
          <stop stopColor="#FC9C9C" />
          <stop offset="0.458879" stopColor="#586EE0" />
          <stop offset="0.891544" stopColor="#A8FF80" />
        </radialGradient>
      </defs>
    </svg>
  );
}
