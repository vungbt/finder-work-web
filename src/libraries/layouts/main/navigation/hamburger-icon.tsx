import clsx from 'clsx';

type HamburgerIconProps = {
  className?: string;
};
export function HamburgerIcon({ className }: HamburgerIconProps) {
  return (
    <label htmlFor="navigation-checkbox" className={clsx('hamburger z-[51]', className)}>
      <div className="hamburger-icon"></div>
    </label>
  );
}
